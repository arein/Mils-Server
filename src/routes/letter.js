/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/express3.d.ts'/>
var mongo = require("mongodb");

var MailClient = require("./../util/mail/client");
var Recipient = require("./../util/mail/model/Recipient");

var BraintreeClient = require("./../util/Braintree/BraintreeClient");
var CreditCard = require('./../util/Braintree/Model/CreditCard');
var TaxationHelper = require('./../util/TaxationHelper');

var PdfWriter = require('./../util/pdf/PdfWriter');
var Config = require('./../config');
var MongoManager = require('./../manager/MongoManager');
var PurchaseValidator = require('./../validator/PurchaseValidator');
var UploadValidator = require('./../validator/UploadValidator');
var LetterFactory = require('./../model/LetterFactory');
var BillHelper = require('./../util/BillHelper');
var Client = require('./../model/Client');
var ClientType = require('./../model/ClientType');
var CurrencyConverter = require('./../util/CurrencyConverter');

var PdfColorInspector = require('./../util/colorinspector/PdfColorInspector');

exports.purchaseLetter = function (req, res) {
    PurchaseValidator.validate(req); // Validate Input
    var id = req.params.id;
    var status = {
        pdfProcessed: false,
        billProcessed: false
    };

    var creditCard = new CreditCard(req.body.creditCard.number, req.body.creditCard.name, req.body.creditCard.date, req.body.creditCard.cvv, req.body.creditCard.type);

    MongoManager.getDb(function (db) {
        db.collection('letter', function (err, collection) {
            collection.findOne({ '_id': new mongo.ObjectID(id) }, function (err, letter) {
                if (err) {
                    res.json(500, "The letter could not be found");
                    return;
                }
                var braintreeClient = new BraintreeClient(!Config.isProd());
                braintreeClient.pay(letter.financialInformation.priceInSettlementCurrency, letter.financialInformation.settlementCurrency, creditCard, function (result) {
                    letter.payed = true;
                    letter.transactionInformation.sandboxTransaction = braintreeClient.isSandbox();
                    letter.transactionInformation.transactionDate = new Date();
                    letter.transactionInformation.transactionId = result.transaction.id;
                    MongoManager.getNextSequence("invoicenumber", function (invoiceNumber) {
                        var sanitize = require('validator').sanitize;
                        letter.invoiceNumber = invoiceNumber;
                        letter.issuer.name = sanitize(req.body.address.name).escape();
                        letter.issuer.address1 = sanitize(req.body.address.line1).escape();
                        letter.issuer.address2 = (typeof req.body.address.line2 === 'undefined') ? undefined : sanitize(req.body.address.line2).escape();
                        letter.issuer.postalCode = sanitize(req.body.address.postalCode).escape();
                        letter.issuer.city = sanitize(req.body.address.city).escape();
                        letter.issuer.country = sanitize(req.body.address.country).escape();
                        letter.issuer.email = sanitize(req.body.emailAddress).escape();

                        var recipient = new Recipient(letter.recipient.name, letter.recipient.address1, letter.recipient.city, letter.recipient.postalCode, letter.recipient.countryIso, letter.issuer.email, letter.recipient.company, letter.recipient.address2, letter.recipient.state);
                        TaxationHelper.processTaxation(letter);

                        var conclude = function (status, letter, res) {
                            if (!status.pdfProcessed || !status.billProcessed)
                                return;
                            letter.updatedAt = new Date();

                            db.collection('letter', function (err, collection) {
                                collection.update({ '_id': letter._id }, letter, { safe: true }, function (err, result) {
                                    if (err) {
                                        res.send(500, { 'error': 'An error has occurred' });
                                    } else {
                                        res.send(letter);
                                    }
                                });
                            });
                        };

                        var prefix = Config.getBasePath() + '/public/pdf/';
                        var ci = new PdfColorInspector();
                        ci.canApplyGrayscale(prefix + letter.pdf, function (isGreyscale) {
                            letter.printInformation.printedInBlackWhite = isGreyscale; // Store whether the letter was printed in greyscale
                            var mailClient = new MailClient();
                            mailClient.sendMail(prefix + letter.pdf, recipient, isGreyscale, function (err, digest) {
                                status.pdfProcessed = true;
                                if (err) {
                                    letter.printInformation.passedToPrintingProvider = false;
                                } else {
                                    letter.financialInformation.printingCost = digest.price;
                                    letter.financialInformation.margin = letter.financialInformation.price - letter.financialInformation.creditCardCost - letter.financialInformation.vat;
                                    letter.printInformation.passedToPrintingProvider = true;
                                    letter.printInformation.passedToPrintingProviderAt = new Date();
                                    letter.printInformation.printJobReference = digest.reference;
                                    letter.printInformation.provider = digest.provider;
                                }

                                conclude(status, letter, res);
                            });
                        });

                        // Send Email
                        BillHelper.sendBill(letter, 'invoice-' + letter.pdf, function (err) {
                            status.billProcessed = true;
                            if (err) {
                                letter.billSent = false;
                            } else {
                                letter.billSent = true;
                                letter.billSentAt = new Date();
                            }

                            conclude(status, letter, res);
                        });
                    });
                }, function (error) {
                    res.json(500, error);
                });
            });
        });
    });
};

exports.uploadLetter = function (req, res) {
    var shouldDownload = req.query.download == 'true';
    UploadValidator.validate(req); // Validation
    var letter = LetterFactory.createLetterFromRequest(req);
    var preferredCurrency = req.query.preferred_currency;

    if (!["AUD", "EUR", "GBP", "USD"].indexOf(preferredCurrency)) {
        preferredCurrency = "EUR"; // Windows 8 Backward Compability
    }

    var pdfWriter = new PdfWriter();
    pdfWriter.writePdf(req.body, letter, function (fileSizeInMegabytes) {
        if (fileSizeInMegabytes > 2) {
            res.send(400, { 'error': 'The File may not be larger than 2mb.' });
            return;
        }

        var mailClient = new MailClient();
        mailClient.calculatePrice(letter.pageCount, letter.recipient.countryIso, function (error, digest) {
            if (error) {
                res.send(502, { 'error': error.message });
                return;
            }

            var preferredPriceShorted = digest.priceInEur.toFixed(2);

            // Update Letter with Price and Digest Information
            var guessedCreditCardCost = BraintreeClient.guessTransactionCost(digest.priceInEur + 0.15);
            var finalPrice = (digest.priceInEur + 0.15 + guessedCreditCardCost) * 1.19;
            finalPrice = parseFloat(finalPrice.toFixed(2));

            CurrencyConverter.convert(CurrencyConverter.convertStringToCurrencyType("EUR"), CurrencyConverter.convertStringToCurrencyType(preferredCurrency), finalPrice, function (result) {
                letter.printInformation.courier = digest.courier;
                letter.printInformation.city = digest.city;
                letter.printInformation.country = digest.country;
                letter.financialInformation.creditCardCost = guessedCreditCardCost;
                letter.financialInformation.price = finalPrice;
                letter.financialInformation.priceInSettlementCurrency = parseFloat(result.toFixed(2));
                letter.financialInformation.settlementCurrency = preferredCurrency;

                MongoManager.getDb(function (db) {
                    db.collection('letter', function (err, collection) {
                        if (err) {
                            res.send(500, "An error occurred on the server side");
                            return;
                        }
                        collection.insert(letter, { safe: true }, function (err, result) {
                            if (err) {
                                res.send(500, "An error occurred on the server side");
                            } else {
                                var responseObject = result[0];
                                responseObject.price = result[0].financialInformation.priceInSettlementCurrency; // Backward compability
                                responseObject.pages = result[0].pages;
                                if (shouldDownload) {
                                    var fs = require('fs');
                                    fs.readFile(Config.getBasePath() + '/public/pdf/' + letter.pdf, function (err, data) {
                                        if (err) {
                                            res.send(500, "An error occurred on the server side:" + err);
                                        } else {
                                            responseObject.pdf = data.toString("base64");
                                            res.send(responseObject);
                                        }
                                    });
                                } else {
                                    res.send(responseObject);
                                }
                            }
                        });
                    });
                });
            });
        });
    });
};

exports.calculatePrice = function (req, res) {
    var check = require('validator').check;
    var pages = req.query.pages, destination = req.query.destination, preferredCurrency = req.query.preferred_currency;

    if (!["AUD", "EUR", "GBP", "USD"].indexOf(preferredCurrency)) {
        res.send(502, { 'error': "Your preferred currency is not supported" });
        return;
    }

    check(pages).notNull().isInt();
    check(destination).notNull();
    check(preferredCurrency).notNull().len(1, 6);

    var mailClient = new MailClient();
    mailClient.calculatePrice(pages, destination, function (error, digest) {
        if (error) {
            res.send(502, { 'error': error.message });
        } else {
            var finalPrice = (digest.priceInEur + 0.15 + BraintreeClient.guessTransactionCost(digest.priceInEur + 0.15)) * 1.19;
            var finalPriceShorted = finalPrice.toFixed(2);

            CurrencyConverter.convert(CurrencyConverter.convertStringToCurrencyType("EUR"), CurrencyConverter.convertStringToCurrencyType(preferredCurrency), finalPrice, function (result) {
                var preferredPriceShorted = result.toFixed(2);
                res.send({ 'preferredCurrency': preferredCurrency, 'priceInEur': finalPriceShorted, 'priceInPreferredCurrency': preferredPriceShorted, 'printingCity': digest.city, 'printingCountry': digest.country, 'courier': digest.courier });
            });
        }
    });
};

exports.pushNotification = function (req, res) {
    var check = require('validator').check;
    check(req.query.device).notNull();
    check(req.params.id).notNull();
    check(req.query.uri).notNull();

    MongoManager.getDb(function (db) {
        db.collection('letter', function (err, collection) {
            collection.findOne({ '_id': new mongo.ObjectID(req.params.id) }, function (err, letter) {
                if (err) {
                    res.json(500, "The letter could not be found");
                    return;
                }

                var client;
                switch (req.query.device) {
                    case "OSX1010":
                        client = new Client(1 /* MacOS1010 */, req.query.uri);
                        letter.devices.push(client);
                        break;
                    default:
                        client = new Client(0 /* Windows81 */, req.query.uri);
                        letter.devices.push(client);
                        break;
                }
                collection.update({ '_id': letter._id }, letter, { safe: true }, function (err, result) {
                    if (err) {
                        res.json(500, { 'error': 'An error has occurred' });
                    } else {
                        res.json("Device added");
                    }
                });
            });
        });
    });
};
//# sourceMappingURL=letter.js.map

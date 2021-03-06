/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/express3.d.ts'/>
var mongo = require("mongodb");

var MailClient = require("./../util/mail/client");

var BraintreeClient = require("./../util/Braintree/BraintreeClient");
var CreditCard = require('./../util/Braintree/Model/CreditCard');
var TaxationHelper = require('./../util/TaxationHelper');

var PdfWriter = require('./../util/pdf/PdfWriter');
var Config = require('./../config');
var MongoManager = require('./../manager/MongoManager');

var PurchaseValidator = require('./../validator/PurchaseValidator');
var UploadValidator = require('./../validator/UploadValidator');
var LetterFactory = require('./../model/LetterFactory');

var Client = require('./../model/Client');
var ClientType = require('./../model/ClientType');
var CurrencyConverter = require('./../util/CurrencyConverter');

var Geocoder = require('./../util/geocoding/Geocoder');

/**
* Endpoint to purchase a letter.
* @param req
* @param res
*/
exports.purchaseLetter = function (req, res) {
    try  {
        PurchaseValidator.validate(req); // Validate Input
    } catch (e) {
        res.json(400, { error: e.message });
        return;
    }

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
                    res.json(404, "The letter could not be found");
                    return;
                }

                MongoManager.getNextSequence("invoicenumber", function (invoiceNumber) {
                    var sanitize = require('validator').sanitize;
                    letter.invoiceNumber = invoiceNumber;
                    letter.issuer.name = sanitize(req.body.address.name).escape();
                    letter.issuer.address1 = sanitize(req.body.address.line1).escape();
                    letter.issuer.address2 = (typeof req.body.address.line2 === 'undefined') ? undefined : sanitize(req.body.address.line2).escape();
                    letter.issuer.postalCode = sanitize(req.body.address.postalCode).escape();
                    letter.issuer.city = sanitize(req.body.address.city).escape();
                    letter.issuer.country = sanitize(req.body.address.country).escape();
                    letter.issuer.email = sanitize(req.body.emailAddress).trim();

                    TaxationHelper.processTaxation(letter); // Set Tax appropriately

                    // Important: Critical Path Begins
                    // The user may not see an error in case of a successful payment
                    var braintreeClient = new BraintreeClient(!Config.isProd());
                    braintreeClient.pay(letter.financialInformation.priceInSettlementCurrency, letter.financialInformation.settlementCurrency, creditCard, function (error, result) {
                        if (error) {
                            res.json(502, { error: error.message });
                            return;
                        }
                        letter.payed = true;
                        letter.transactionInformation.sandboxTransaction = braintreeClient.isSandbox();
                        letter.transactionInformation.transactionDate = new Date();
                        letter.transactionInformation.transactionId = result.transaction.id;
                        letter.updatedAt = new Date();
                        collection.update({ '_id': letter._id }, letter, { safe: true }, function (err, result) {
                            res.send(letter);
                            /*
                            // Try to Dispatch the letter
                            MailManager.transferLetterToPrintProvider(letter, function (error:Error) {
                            status.pdfProcessed = true;
                            conclude(status, letter, res);
                            });
                            
                            // Try to send the bill
                            BillingManager.generateAndSendBillForLetter(letter, function (err:Error) {
                            status.billProcessed = true;
                            conclude(status, letter, res);
                            });
                            */
                        });
                    });
                });
            });
        });
    });
};

/**
* Endpoint to upload a letter.
* @param req
* @param res
*/
exports.uploadLetter = function (req, res) {
    var shouldDownload = req.query.download == 'true';

    try  {
        UploadValidator.validate(req); // Validation
    } catch (e) {
        res.json(502, { error: e.message });
        return;
    }

    var letter = LetterFactory.createLetterFromRequest(req);
    var preferredCurrency = req.query.preferred_currency;

    if (typeof preferredCurrency === 'undefined' || ["AUD", "EUR", "GBP", "USD"].indexOf(preferredCurrency) < 0) {
        preferredCurrency = "EUR"; // Windows 8 Backward Compability
    }

    var pdfWriter = new PdfWriter();
    pdfWriter.writePdf(req.body, letter, function (fileSizeInMegabytes) {
        if (fileSizeInMegabytes > 10) {
            res.send(400, { 'error': 'The File may not be larger than 10mb.' });
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
            var guessedCreditCardCost = BraintreeClient.guessTransactionCost(digest.priceInEur + 0.20);
            var finalPrice = (digest.priceInEur + 0.20 + guessedCreditCardCost) * 1.27;
            finalPrice = parseFloat(finalPrice.toFixed(2));

            CurrencyConverter.convert(CurrencyConverter.convertStringToCurrencyType("EUR"), CurrencyConverter.convertStringToCurrencyType(preferredCurrency), finalPrice, function (result) {
                letter.printInformation.courier = digest.courier;
                letter.printInformation.city = digest.city;
                letter.printInformation.country = digest.country;
                letter.financialInformation.creditCardCost = guessedCreditCardCost;
                letter.financialInformation.price = finalPrice;
                letter.financialInformation.priceInSettlementCurrency = parseFloat(result.toFixed(2));
                letter.financialInformation.settlementCurrency = CurrencyConverter.convertStringToCurrencyType(preferredCurrency);

                MongoManager.getDb(function (db) {
                    db.collection('letter', function (err, collection) {
                        if (err) {
                            res.send(500, { 'error': "An error occurred on the server side" });
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
                                            res.send(500, { 'error': "An error occurred on the server side:" + err });
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

/**
* Calculates the priceInAud of the letter for a given number of pages.
* @param req
* @param res
*/
exports.calculatePrice = function (req, res) {
    var check = require('validator').check;
    var pages = req.query.pages, destination = req.query.destination, preferredCurrency = req.query.preferred_currency;

    if (["AUD", "EUR", "GBP", "USD"].indexOf(preferredCurrency) < 0) {
        res.send(502, { 'error': "Your preferred currency is not supported" });
        return;
    }

    // Check the input
    check(pages).notNull().isInt();
    check(destination).notNull();
    check(preferredCurrency).notNull().len(1, 6);

    var mailClient = new MailClient();
    mailClient.calculatePrice(pages, destination, function (error, digest) {
        if (error) {
            res.send(502, { 'error': error.message });
        } else {
            var finalPrice = (digest.priceInEur + 0.20 + BraintreeClient.guessTransactionCost(digest.priceInEur + 0.20)) * 1.27;
            var finalPriceShorted = finalPrice.toFixed(2);

            CurrencyConverter.convert(CurrencyConverter.convertStringToCurrencyType("EUR"), CurrencyConverter.convertStringToCurrencyType(preferredCurrency), finalPrice, function (result) {
                var preferredPriceShorted = result.toFixed(2);
                res.send({ 'preferredCurrency': preferredCurrency, 'priceInEur': finalPriceShorted, 'priceInPreferredCurrency': preferredPriceShorted, 'printingCity': digest.city, 'printingCountry': digest.country, 'courier': digest.courier });
            });
        }
    });
};

/**
* Subscribes a device to receive a Push Notification upon the dispatchment of the letter.
* @param req
* @param res
*/
exports.pushNotification = function (req, res) {
    var check = require('validator').check;
    check(req.query.device).notNull();
    check(req.params.id).notNull();
    check(req.query.uri).notNull();

    MongoManager.getDb(function (db) {
        db.collection('letter', function (err, collection) {
            collection.findOne({ '_id': new mongo.ObjectID(req.params.id) }, function (err, letter) {
                if (err) {
                    res.json(404, "The letter could not be found");
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

                letter.updatedAt = new Date(); // Update the date
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

exports.geocode = function (req, res) {
    try  {
        var check = require('validator').check;
        check(req.body.address).notNull();
    } catch (e) {
        res.send(400, { 'error': e.message });
        return;
    }

    var address = req.body.address;
    Geocoder.geocode(address, function (error, location) {
        if (typeof error != "undefined") {
            res.send(500, { 'error': error.message });
            return;
        }

        res.send(location);
    });
};
//# sourceMappingURL=letter.js.map

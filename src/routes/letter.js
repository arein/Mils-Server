/// <reference path='./../typescript-node-definitions/node.d.ts'/>
/// <reference path='././mongodb.d.ts'/>
/// <reference path='././express3.d.ts'/>
var mongo = require("mongodb");
var Server = mongo.Server;
var Db = mongo.Db;

var MailClient = require("././client");
var Recipient = require("././model/Recipient");

var BraintreeClient = require("././Braintree/BraintreeClient");
var CreditCard = require('././Braintree/Model/CreditCard');
var TaxationHelper = require('././TaxationHelper');
var Letter = require('././Letter');
var PdfWriter = require('././Pdf/PdfWriter');
var PdfInvoice = require('././PdfInvoice');

// TODO: Refactor
var server = new Server('localhost', 27017, { auto_reconnect: true });
var db = new Db('letterdb', server);

db.open(function (err, db) {
    if (!err) {
        db.createCollection('letter', { strict: true }, function (err, collection) {
            if (!err) {
                console.log("The letter collection doesn't exist. Creating it with sample data");
            }
        });

        db.createCollection('counters', { strict: true }, function (err, collection) {
            if (!err) {
                console.log("Counters Collection created. Creating it with sample data");
                populateDB();
            }
        });
    }
});

exports.purchaseLetter = function (req, res) {
    var check = require('validator').check, sanitize = require('validator').sanitize;

    // Validation
    var id = req.params.id;
    check(id).notNull();
    check(req.body).notNull();
    check(req.body.emailAddress).notNull().isEmail();
    check(req.body.address).notNull();
    check(req.body.creditCard).notNull();
    check(req.body.creditCard.number).notNull();
    req.body.creditCard.type = undefined; // we do not need this input
    check(req.body.creditCard.cvv).notNull();
    check(req.body.creditCard.date).notNull();
    check(req.body.address.name).notNull();
    check(req.body.address.line1).notNull();
    check(req.body.address.postalCode).notNull();
    check(req.body.address.city).notNull();
    check(req.body.address.country).notNull();

    var status = {
        pdfProcessed: false,
        billProcessed: false
    };

    var creditCard = new CreditCard(req.body.creditCard.number, req.body.creditCard.name, req.body.creditCard.date, req.body.creditCard.cvv, req.body.creditCard.type);

    db.collection('letter', function (err, collection) {
        collection.findOne({ '_id': new mongo.ObjectID(id) }, function (err, letter) {
            if (err)
                throw err;
            var braintreeClient = new BraintreeClient(true);
            braintreeClient.pay(letter.price, creditCard, function (result) {
                letter.payed = true;
                letter.sandboxPurchase = braintreeClient.isSandbox();
                letter.purchaseDate = new Date();
                letter.transactionId = result.transaction.id;
                getNextSequence("invoicenumber", function (invoiceNumber) {
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

                    var mailClient = new MailClient();
                    var app = require('./../app');
                    var prefix = app.basePath + '/public/pdf/';
                    mailClient.sendMail(prefix + letter.pdf, recipient, function (err, digest) {
                        status.pdfProcessed = true;

                        if (err) {
                            letter.dispatched = false;
                            letter.printInformation.provider = digest.provider;
                        } else {
                            letter.dispatched = true;
                            letter.dispatchedAt = new Date();
                            letter.pdfId = digest.reference;
                            letter.printInformation.provider = digest.provider;
                        }

                        conclude(status, letter, res);
                    });

                    // Send Email
                    sendBill(letter, 'invoice-' + letter.pdf, function (err) {
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
};

function conclude(status, letter, res) {
    if (!status.pdfProcessed || !status.billProcessed) {
        return;
    }
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
}

function sendBill(letter, fileName, callback) {
    var fs = require("fs");
    var app = require('./../app');
    var pdfInvoice = new PdfInvoice();
    var prefix = app.basePath + '/public/pdf/';
    var path = prefix + fileName;

    pdfInvoice.createInvoice(letter, function (data) {
        fs.writeFile(path, data, function (err) {
            if (err)
                throw err;
            var email = letter.issuer.name + ' <' + letter.issuer.email + '>';
            var serverPath = "https://milsapp.com";

            if ('development' == app.get('env')) {
                email = '"Ceseros" <test@dev.ceseros.de>';
                serverPath = "http://localhost:3000";
            }

            app.mailer.send('email', {
                to: email,
                subject: 'Purchase',
                invoiceNumber: letter.invoiceNumber,
                serverPath: serverPath
            }, {
                attachments: [{ fileName: 'Invoice.pdf', filePath: path }]
            }, callback);
        });
    });
}

exports.uploadLetter = function (req, res) {
    // Validation
    var check = require('validator').check;
    var sanitize = require('validator').sanitize;
    check(req.body.pdf).notNull();
    check(req.body.recipientName).notNull();
    check(req.body.recipientAddress1).notNull();
    check(req.body.recipientCity).notNull();
    check(req.body.recipientPostalCode).notNull();
    check(req.body.recipientCountryIso).notNull();

    var shouldDownload = req.query.download == 'true';

    // Letter Creation
    var letter = new Letter();
    letter.createdAt = new Date();
    letter.updatedAt = new Date();
    letter.dispatched = false;
    letter.billSent = false;
    letter.recipient.name = sanitize(req.body.recipientName).escape();
    letter.recipient.company = (typeof req.body.recipientCompany === 'undefined') ? undefined : sanitize(req.body.recipientCompany).escape();
    letter.recipient.address1 = sanitize(req.body.recipientAddress1).escape();
    letter.recipient.address2 = (typeof req.body.recipientAddress2 === 'undefined') ? undefined : sanitize(req.body.recipientAddress2).escape();
    letter.recipient.city = sanitize(req.body.recipientCity).escape();
    letter.recipient.postalCode = sanitize(req.body.recipientPostalCode).escape();
    letter.recipient.countryIso = (typeof req.body.recipientCountryIso === 'undefined') ? undefined : sanitize(req.body.recipientCountryIso).escape();

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

            var finalPrice = (digest.priceInEur + 0.15 + 0.35) * 1.19;
            finalPrice = parseFloat(finalPrice.toFixed(2));

            letter.printInformation.courier = digest.courier;
            letter.printInformation.city = digest.city;
            letter.printInformation.country = digest.country;
            letter.printingCost = digest.priceInEur;
            letter.margin = 0.15;
            letter.creditCardCost = 0.35;
            letter.price = finalPrice;
            db.collection('letter', function (err, collection) {
                collection.insert(letter, { safe: true }, function (err, result) {
                    if (err) {
                        res.send(500, "An error occurred on the server side");
                    } else {
                        if (shouldDownload) {
                            var fs = require('fs');
                            var app = require('./../app');
                            fs.readFile(app.basePath + '/public/pdf/' + letter.pdf, function (err, data) {
                                if (err)
                                    res.send(500, "An error occurred on the server side:" + err);
                                result[0].pdf = data.toString("base64");
                                res.send(result[0]);
                            });
                        } else {
                            res.send(result[0]);
                        }
                    }
                });
            });
        });
    });
};

exports.calculatePrice = function (req, res) {
    var check = require('validator').check;
    var pages = req.query.pages, destination = req.query.destination, preferredCurrency = req.query.preferred_currency;

    check(pages).notNull().isInt();
    check(destination).notNull();
    check(preferredCurrency).notNull().len(1, 6);

    var mailClient = new MailClient();
    mailClient.calculatePrice(pages, destination, function (error, digest) {
        if (error) {
            res.send(502, { 'error': error.message });
        } else {
            var finalPrice = (digest.priceInEur + 0.15 + 0.35) * 1.19;
            var finalPriceShorted = finalPrice.toFixed(2);

            res.send({ 'preferredCurrency': preferredCurrency, 'priceInEur': finalPriceShorted, 'priceInPreferredCurrency': finalPriceShorted, 'printingCity': digest.city, 'printingCountry': digest.country, 'courier': digest.courier });
        }
    });
};

var path = require('path');
var mime = require('mime');

exports.osxDownload = function (req, res) {
    var app = require('./../app');
    var file = app.basePath + '/public/downloads/Mils.app.zip';
    res.download(file);
};

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function () {
    var counters = [{
            _id: "invoicenumber",
            seq: 15000
        }];

    db.collection('counters', function (err, collection) {
        collection.insert(counters, { safe: true }, function (err, result) {
        });
    });
};

function getNextSequence(name, callback) {
    db.collection('counters', function (err, collection) {
        collection.findAndModify({ _id: name }, [['_id', 'asc']], { $inc: { seq: 1 } }, { new: true }, function (error, item) {
            if (err)
                throw err;
            callback(item.seq);
        });
    });
}
//# sourceMappingURL=letter.js.map

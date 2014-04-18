///<reference path='./../typescript-node-definitions/node.d.ts'/>
///<reference path='./../typescript-node-definitions/mongodb.d.ts'/>
///<reference path='./../typescript-node-definitions/express3.d.ts'/>
var express = require("express");
var mongo = require('mongodb');

/*
* GET users listing.
*/
var Server = mongo.Server, Db = mongo.Db, BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, { auto_reconnect: true });
var db = new Db('letterdb', server);

db.open(function (err, db) {
    if (!err) {
        console.log("Connected to winedb database");
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

    db.collection('letter', function (err, collection) {
        collection.findOne({ '_id': new BSON.ObjectID(id) }, function (err, item) {
            if (err)
                throw err;
            var braintreeHelper = new (require('./../util/braintree_helper')).BraintreeHelper(true);
            braintreeHelper.pay(item.price, req.body.creditCard, function (result) {
                item.payed = true;
                item.sandboxPurchase = braintreeHelper.isSandbox();
                item.purchased = new Date();
                item.transactionId = result.transaction.id;
                getNextSequence("invoicenumber", function (invoiceNumber) {
                    item.invoiceNumber = invoiceNumber;
                    item.billingName = req.body.address.name;
                    item.billingLine1 = req.body.address.line1;
                    item.billingLine2 = req.body.address.line2;
                    item.billingPostalCode = req.body.address.postalCode;
                    item.billingCity = req.body.address.city;
                    item.billingCountry = req.body.address.country;
                    item.billingEmail = req.body.emailAddress;

                    // Generate Recipient Object
                    var recipient = {
                        name: item.recipientName,
                        company: item.recipientCompany,
                        address1: item.recipientAddress1,
                        address2: item.recipientAddress2,
                        city: item.recipientCity,
                        state: item.recipientState,
                        zip: item.recipientPostalCode,
                        country: item.recipientCountryIso,
                        email: item.billingEmail
                    };

                    processTaxation(item);

                    var mc = require('./../mail/client');
                    var mailClient = new mc.MailClient();
                    var prefix = app.basePath + '/public/pdf/';
                    mailClient.sendMail(prefix + item.pdf, recipient, function (err, provider, letterId) {
                        status.pdfProcessed = true;

                        if (err) {
                            item.pdfDelivered = false;
                            item.provider = provider;
                        } else {
                            item.pdfDelivered = true;
                            item.pdfId = letterId;
                            item.provider = provider;
                        }

                        conclude(status, item, res);
                    });

                    // Send Email
                    sendBill(req.body, item, 'invoice-' + item.pdf, function (err) {
                        status.billProcessed = true;
                        if (err) {
                            item.billSent = false;
                        } else {
                            item.billSent = true;
                        }

                        conclude(status, item, res);
                    });
                });
            }, function (error) {
                res.json(500, error);
            });
        });
    });
};

function processTaxation(letter) {
    var isoCountry = letter.billingCountry;
    var net = parseFloat(parseFloat(letter.price / 1.19).toFixed(2));
    var vat = parseFloat(parseFloat(letter.price - net).toFixed(2));
    if (isInEU(isoCountry)) {
        letter.net = net;
        letter.vat = vat;
    } else {
        letter.vatIncome = vat;
        letter.net = letter.price;
        letter.vat = 0;
    }
}

function isInEU(isoCountry) {
    switch (isoCountry) {
        case 'BE':
        case 'BG':
        case 'HR':
        case 'DK':
        case 'DE':
        case 'EE':
        case 'FI':
        case 'FR':
        case 'GR':
        case 'IE':
        case 'IT':
        case 'LT':
        case 'LV':
        case 'LU':
        case 'MT':
        case 'NL':
        case 'AT':
        case 'PL':
        case 'RO':
        case 'PT':
        case 'SE':
        case 'SK':
        case 'SI':
        case 'ES':
        case 'HU':
        case 'CZ':
        case 'GB':
        case 'CY':
            return true;
        default:
            return false;
    }
}

function conclude(status, letter, res) {
    if (!status.pdfProcessed || !status.billProcessed) {
        return;
    }
    letter.upadtedAt = new Date();

    db.collection('letter', function (err, collection) {
        collection.update({ '_id': letter._id }, letter, { safe: true }, function (err, result) {
            if (err) {
                console.log('Error updating letter: ' + err);
                res.send(500, { 'error': 'An error has occurred' });
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(letter);
            }
        });
    });
}

function sendBill(recipient, letter, fileName, callback) {
    var fs = require("fs");
    var pdf = require(app.basePath + "/pdf/pdf_invoice");
    var pdfInvoice = new pdf.PdfInvoice();
    var prefix = app.basePath + '/public/pdf/';
    var path = prefix + fileName;
    var description = letter.pageCount + " pages to " + letter.recipientCountryIso;
    if (letter.pageCount == 1) {
        description = letter.pageCount + " page to " + letter.recipientCountryIso;
    }

    pdfInvoice.createInvoice(recipient, new Date(), letter.invoiceNumber, description, letter.net, letter.vat, letter.price, function (data) {
        fs.writeFile(path, data, function (err) {
            if (err)
                throw err;
            var email = letter.billingName + ' <' + letter.billingEmail + '>';
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
    check(req.body.pdf).notNull();
    check(req.body.recipientName).notNull();
    check(req.body.recipientAddress1).notNull();
    check(req.body.recipientCity).notNull();
    check(req.body.recipientPostalCode).notNull();
    check(req.body.recipientCountryIso).notNull();

    var shouldDownload = req.query.download == 'true';

    var letter = req.body;
    letter.createdAt = new Date();
    letter.upadtedAt = new Date();
    letter.pdfDelivered = false;
    letter.billSent = false;
    letter.payed = false;
    letter.pdfId = null;
    letter.provider = null;

    // Recipient Data
    letter.recipientName = req.body.recipientName;
    letter.recipientCompany = (req.body.recipientCompany == undefined) ? false : req.body.recipientCompany;
    letter.recipientAddress1 = req.body.recipientAddress1;
    letter.recipientAddress2 = (req.body.recipientAddress2 == undefined) ? false : req.body.recipientAddress2;
    letter.recipientCity = req.body.recipientCity;
    letter.recipientPostalCode = req.body.recipientPostalCode;
    letter.recipientState = (req.body.recipientState == undefined) ? false : req.body.recipientState;
    letter.recipientCountryIso = req.body.recipientCountryIso;

    var tmp = require('tmp');
    var prefix = app.basePath + '/public/pdf/';
    tmp.tmpName({ template: prefix + 'letter-XXXXXX.pdf' }, function _tempNameGenerated(err, path) {
        if (err)
            throw err;

        // Write PDF to File
        if (letter.pages != undefined) {
            var PDFDocument = require('pdfkit');
            var doc = new PDFDocument({ size: 'A4' });
            doc.image(new Buffer(letter.pages[0].image, 'base64'), 0, 0, { fit: [595.28, 841.89] });
            var signature = new Buffer(letter.signature, 'base64');
            addSignatures(signature, doc, letter.pages[0].signatures);
            for (var i = 1; i < letter.pages.length; i++) {
                doc.addPage();
                doc.image(new Buffer(letter.pages[i].image, 'base64'), 0, 0, { fit: [595.28, 841.89] });
                addSignatures(signature, doc, letter.pages[i].signatures);
            }
            doc.output(function (data) {
                var fs = require('fs');
                fs.writeFile(path, data, function (err) {
                    if (err)
                        throw err;
                    letter.pdf = path.replace(prefix, ''); // "Repair Path"
                    letter.pageCount = letter.pages.length;
                    letter.pages = undefined;
                    letter.signature = undefined;
                    insertLetter(letter, res, shouldDownload);
                });
            });
        } else {
            var fs = require('fs');
            var buf = new Buffer(letter.pdf, 'base64');
            fs.writeFile(path, buf, function (err) {
                if (err)
                    throw err;

                letter.pdf = path.replace(prefix, ''); // "Repair Path"
                var PFParser = require("pdf2json");
                var pdfParser = new PFParser();
                pdfParser.on("pdfParser_dataReady", function (data) {
                    letter.pageCount = data.PDFJS.pages.length;
                    insertLetter(letter, res, shouldDownload);
                });
                pdfParser.on("pdfParser_dataError", function (error) {
                    throw error;
                });
                pdfParser.loadPDF(path);
            });
        }
    });
};

function addSignatures(buffer, doc, signatures) {
    var scaleFactor = 1.0101968821;
    for (var i = 0; i < signatures.length; i++) {
        doc.image(buffer, signatures[i].x, signatures[i].y * scaleFactor, { width: signatures[i].width, height: signatures[i].height * scaleFactor });
    }
}

function insertLetter(letter, res, shouldDownload) {
    var fs = require('fs');
    var check = require('validator').check;
    var prefix = app.basePath + '/public/pdf/';

    var stats = fs.statSync(prefix + letter.pdf);
    var fileSizeInBytes = stats["size"];

    //Convert the file size to megabytes (optional)
    var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

    if (fileSizeInMegabytes > 2) {
        res.send(400, { 'error': 'The File may not be larger than 2mb.' });
        return;
    }

    var mailClient = new (require('./../mail/client')).MailClient();
    mailClient.calculatePrice(letter.pageCount, letter.recipientCountryIso, "EUR", function (error, priceInEur, price, city, country, courier) {
        if (error) {
            res.send(502, { 'error': error.message });
            return;
        }

        var finalPrice = (price + 0.15 + 0.35) * 1.19;
        finalPrice = parseFloat(finalPrice).toFixed(2);

        letter.courier = courier;
        letter.printingCity = city;
        letter.printingCountry = country;
        letter.printingPrice = priceInEur;
        letter.marginApplied = 0.15;
        letter.vatIncome = 0;
        letter.creditCardPrice = 0.35;
        letter.price = finalPrice;
        db.collection('letter', function (err, collection) {
            collection.insert(letter, { safe: true }, function (err, result) {
                if (err) {
                    res.send(500, "An error occurred on the server side");
                } else {
                    if (shouldDownload) {
                        fs.readFile(prefix + letter.pdf, function (err, data) {
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
}

exports.calculatePrice = function (req, res) {
    var check = require('validator').check;
    var pages = req.query.pages, destination = req.query.destination, preferredCurrency = req.query.preferred_currency;

    check(pages).notNull().isInt();
    check(destination).notNull();
    check(preferredCurrency).notNull().len(1, 6);

    var mailClient = new (require('./../mail/client')).MailClient();
    mailClient.calculatePrice(pages, destination, preferredCurrency, function (error, price, price, city, country, courier) {
        if (error) {
            res.send(502, { 'error': error.message });
        } else {
            var finalPrice = (price + 0.15 + 0.35) * 1.19;
            finalPrice = parseFloat(finalPrice).toFixed(2);

            res.send({ 'preferredCurrency': preferredCurrency, 'priceInEur': finalPrice, 'priceInPreferredCurrency': finalPrice, 'printingCity': city, 'printingCountry': country, 'courier': courier });
        }
    });
};

var path = require('path');
var mime = require('mime');

exports.osxDownload = function (req, res) {
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

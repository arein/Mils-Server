/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/express3.d.ts'/>

import express = require("express3")
import mongo = require("mongodb")
import ObjectId = mongo.ObjectID
import MailClient = require("./../util/mail/client")
import Recipient = require("./../util/mail/model/Recipient")
import CalculatePriceDigest = require("./../util/mail/model/CalculatePriceDigest")
import BraintreeClient = require("./../util/Braintree/BraintreeClient")
import CreditCard = require('./../util/Braintree/Model/CreditCard')
import TaxationHelper = require('./../util/TaxationHelper')
import Letter = require('./../model/Letter')
import PdfWriter = require('./../util/Pdf/PdfWriter')
import Config = require('./../config')
import MongoManager = require('./../manager/MongoManager')
import PurchaseValidator = require('./../validator/PurchaseValidator')
import UploadValidator = require('./../validator/UploadValidator')
import LetterFactory = require('./../model/LetterFactory')
import BillHelper = require('./../util/BillHelper')

exports.purchaseLetter = function(req : express.Request, res : express.Response) {
    PurchaseValidator.validate(req); // Validate Input
    var id = req.params.id;
    var status = {
        pdfProcessed: false,
        billProcessed: false
    };

    var creditCard = new CreditCard(req.body.creditCard.number, req.body.creditCard.name, req.body.creditCard.date, req.body.creditCard.cvv, req.body.creditCard.type);

    MongoManager.getInstance().db.collection('letter', function(err : Error, collection : mongo.Collection) {
        collection.findOne({'_id':new mongo.ObjectID(id)}, function(err : Error, letter : Letter) {
            if (err) throw err;
            var braintreeClient = new BraintreeClient(true);
            braintreeClient.pay(letter.price, creditCard, function (result) {
                letter.payed = true;
                letter.sandboxPurchase = braintreeClient.isSandbox();
                letter.purchaseDate = new Date();
                letter.transactionId = result.transaction.id;
                MongoManager.getInstance().getNextSequence("invoicenumber", function (invoiceNumber) {
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

                    var conclude = function(status, letter : Letter, res : express.Response) {
                        if (!status.pdfProcessed || !status.billProcessed) return;
                        letter.updatedAt = new Date();

                        MongoManager.getInstance().db.collection('letter', function(err : Error, collection) {
                            collection.update({'_id':letter._id}, letter, {safe:true}, function(err : Error, result : number) {
                                if (err) {
                                    res.send(500, {'error':'An error has occurred'});
                                } else {
                                    res.send(letter);
                                }
                            });
                        });
                    }

                    var mailClient = new MailClient();
                    var prefix = Config.getBasePath() + '/public/pdf/';
                    mailClient.sendMail(prefix + letter.pdf, recipient, function(err, digest) {
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
                    BillHelper.sendBill(letter, 'invoice-' + letter.pdf, function (err : Error) {
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

exports.uploadLetter = function(req : express.Request, res : express.Response) {
    var shouldDownload = req.query.download == 'true'; // Determine whether the pdf should be downloaded
    UploadValidator.validate(req); // Validation
    var letter = LetterFactory.createLetterFromRequest(req); // Letter Creation

    var pdfWriter = new PdfWriter();
    pdfWriter.writePdf(req.body, letter, function (fileSizeInMegabytes: number) {

        if (fileSizeInMegabytes > 2) {
            res.send(400, {'error': 'The File may not be larger than 2mb.'});
            return;
        }

        var mailClient = new MailClient();
        mailClient.calculatePrice(letter.pageCount, letter.recipient.countryIso, function (error: Error, digest?: CalculatePriceDigest) {
            if (error) {
                res.send(502, {'error': error.message});
                return;
            }

            // Update Letter with Price and Digest Information
            var finalPrice = (digest.priceInEur + 0.15 + 0.35) * 1.19;
            finalPrice = parseFloat(finalPrice.toFixed(2));
            letter.printInformation.courier = digest.courier;
            letter.printInformation.city = digest.city;
            letter.printInformation.country = digest.country;
            letter.printingCost = digest.priceInEur;
            letter.margin = 0.15;
            letter.creditCardCost = 0.35;
            letter.price = finalPrice;

            MongoManager.getInstance().db.collection('letter', function(err, collection) {
                collection.insert(letter, {safe:true}, function(err, result) {
                    if (err) {
                        res.send(500, "An error occurred on the server side");
                    } else {
                        if (shouldDownload) {
                            var fs = require('fs');
                            var app = require('./../app');
                            fs.readFile(Config.getBasePath() + '/public/pdf/' + letter.pdf, function (err,data) {
                                if (err) res.send(500, "An error occurred on the server side:" + err);
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
    })
}

exports.calculatePrice = function(req: express.Request, res: express.Response) {
    var check = require('validator').check; // Validation
    var pages = req.query.pages,
        destination = req.query.destination,
        preferredCurrency = req.query.preferred_currency;

    check(pages).notNull().isInt();
    check(destination).notNull();
    check(preferredCurrency).notNull().len(1,6);

    var mailClient = new MailClient();
    mailClient.calculatePrice(pages, destination, function (error : Error, digest?: CalculatePriceDigest) {
        if (error) {
            res.send(502, {'error': error.message});
        } else {
            var finalPrice : number = (digest.priceInEur + 0.15 + 0.35) * 1.19;
            var finalPriceShorted : string = finalPrice.toFixed(2);

            res.send({'preferredCurrency': preferredCurrency, 'priceInEur': finalPriceShorted, 'priceInPreferredCurrency': finalPriceShorted, 'printingCity': digest.city, 'printingCountry': digest.country, 'courier': digest.courier});
        }
    });
};
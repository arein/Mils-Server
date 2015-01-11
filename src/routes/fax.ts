/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/express3.d.ts'/>

import express = require("express3")
import mongo = require("mongodb")
import ObjectId = mongo.ObjectID
import MailClient = require("./../util/mail/client")
import CalculatePriceDigest = require("./../util/mail/model/CalculatePriceDigest")
import BraintreeClient = require("./../util/Braintree/BraintreeClient")
import CreditCard = require('./../util/Braintree/Model/CreditCard')
import TaxationHelper = require('./../util/TaxationHelper')
import Fax = require('./../model/Fax')
import AbstractSendable = require('./../model/AbstractSendable')
import PdfWriter = require('./../util/pdf/PdfWriter')
import Config = require('./../config')
import MongoManager = require('./../manager/MongoManager')
import MailManager = require('./../manager/MailManager')
import PurchaseValidator = require('./../validator/PurchaseValidator')
import UploadValidator = require('./../validator/UploadValidator')
import FaxFactory = require('./../model/FaxFactory')
import BillingManager = require('./../manager/BillingManager')
import Client = require('./../model/Client')
import ClientType = require('./../model/ClientType')
import CurrencyConverter = require('./../util/CurrencyConverter')
import Currency = require('./../util/Braintree/Model/Currency')
import Geocoder = require('./../util/geocoding/Geocoder')
import Location = require('./../util/geocoding/Location')

/**
 * Endpoint to purchase a letter.
 * @param req
 * @param res
 */
exports.getPrice = function(req : express.Request, res : express.Response) {


};

/**
 * Endpoint to upload a letter.
 * @param req
 * @param res
 */
exports.uploadFax = function(req : express.Request, res : express.Response) {
    var shouldDownload = req.query.download == 'true'; // Determine whether the pdf should be downloaded

    /*
     try {
     UploadValidator.validate(req); // Validation
     } catch (e) {
     res.json(502, {error: e.message});
     return;
     }
     */

    var fax: Fax = FaxFactory.createFaxFromRequest(req); // Letter Creation

    var pdfWriter = new PdfWriter();
    pdfWriter.writePdf(req.body, fax, function (fileSizeInMegabytes: number) {

        if (fileSizeInMegabytes > 10) {
            res.send(400, {'error': 'The File may not be larger than 10mb.'});
            return;
        }

        MongoManager.getDb(function (db : mongo.Db) {
            db.collection('fax', function (err, collection) {
                if (err) {
                    res.send(500, {'error':  "An error occurred on the server side"});
                    return;
                }
                collection.insert(fax, {safe: true}, function (err, result) {
                    if (err) {
                        res.send(500, "An error occurred on the server side");
                    } else {
                        var responseObject: any = result[0];
                        responseObject.price = result[0].financialInformation.priceInSettlementCurrency; // Backward compability
                        responseObject.pages = result[0].pages;
                        if (shouldDownload) {
                            var fs = require('fs');
                            fs.readFile(Config.getBasePath() + '/public/pdf/' + fax.pdf, function (err, data) {
                                if (err) {
                                    res.send(500, {'error':  "An error occurred on the server side:" + err});
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
};

/**
 * Endpoint to upload a letter.
 * @param req
 * @param res
 */
exports.getIapSku = function(req : express.Request, res : express.Response) {

};

/**
 * Endpoint to upload a letter.
 * @param req
 * @param res
 */
exports.confirmPurchase = function(req : express.Request, res : express.Response) {

};
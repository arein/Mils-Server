/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/express3.d.ts'/>
var PdfWriter = require('./../util/pdf/PdfWriter');
var Config = require('./../config');
var MongoManager = require('./../manager/MongoManager');

var FaxFactory = require('./../model/FaxFactory');

/**
* Endpoint to purchase a letter.
* @param req
* @param res
*/
exports.getPrice = function (req, res) {
};

/**
* Endpoint to upload a letter.
* @param req
* @param res
*/
exports.uploadFax = function (req, res) {
    var shouldDownload = req.query.download == 'true';

    /*
    try {
    UploadValidator.validate(req); // Validation
    } catch (e) {
    res.json(502, {error: e.message});
    return;
    }
    */
    var fax = FaxFactory.createFaxFromRequest(req);

    var pdfWriter = new PdfWriter();
    pdfWriter.writePdf(req.body, fax, function (fileSizeInMegabytes) {
        if (fileSizeInMegabytes > 10) {
            res.send(400, { 'error': 'The File may not be larger than 10mb.' });
            return;
        }

        MongoManager.getDb(function (db) {
            db.collection('fax', function (err, collection) {
                if (err) {
                    res.send(500, { 'error': "An error occurred on the server side" });
                    return;
                }
                collection.insert(fax, { safe: true }, function (err, result) {
                    if (err) {
                        res.send(500, "An error occurred on the server side");
                    } else {
                        var responseObject = result[0];
                        responseObject.price = result[0].financialInformation.priceInSettlementCurrency; // Backward compability
                        responseObject.pages = result[0].pages;
                        if (shouldDownload) {
                            var fs = require('fs');
                            fs.readFile(Config.getBasePath() + '/public/pdf/' + fax.pdf, function (err, data) {
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
};

/**
* Endpoint to upload a letter.
* @param req
* @param res
*/
exports.getIapSku = function (req, res) {
};

/**
* Endpoint to upload a letter.
* @param req
* @param res
*/
exports.confirmPurchase = function (req, res) {
};
//# sourceMappingURL=fax.js.map

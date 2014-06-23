/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
var Config = require('./../config');
var PdfInvoice = require('./pdf/invoice/PdfInvoice');
var BillHelper = (function () {
    function BillHelper() {
    }
    BillHelper.sendBill = function (letter, fileName, callback) {
        var fs = require("fs");
        var pdfInvoice = new PdfInvoice();
        var prefix = Config.getBasePath() + '/public/pdf/';
        var path = prefix + fileName;

        pdfInvoice.createInvoice(letter, function (data) {
            fs.writeFile(path, data, function (err) {
                if (err) {
                    callback(err);
                    return;
                }

                BillHelper.sendMail(letter, path, callback);
            });
        });
    };

    BillHelper.sendMail = function (letter, billPath, callback) {
        var nodemailer = require("nodemailer");
        var jade = require('jade');
        var dateFormat = require('dateformat');

        var prettyPassedToPrintingProviderAt = dateFormat(letter.printInformation.passedToPrintingProviderAt, "shortDate");
        var prettyDispatchedByPrintingProviderAt = dateFormat(letter.printInformation.passedToPrintingProviderAt, "shortDate");

        var options = {
            pretty: true,
            invoiceNumber: letter.invoiceNumber,
            serverPath: Config.getBaseUri()
        };

        jade.renderFile(Config.getBasePath() + '/views/email.jade', options, function (err, html) {
            if (err) {
                callback(err);
                return;
            }

            // create reusable transport method (opens pool of SMTP connections)
            var smtpTransport = Config.getNodemailerTransport();

            var message = "Please see the HTML Version of this email for more information.";

            // setup e-mail data with unicode symbols
            var mailOptions = {
                from: "hello@milsapp.com",
                to: letter.issuer.email,
                subject: "Mils Billing",
                text: message,
                html: html,
                attachments: [{ fileName: 'Invoice.pdf', filePath: billPath }]
            };

            // send mail with defined transport object
            smtpTransport.sendMail(mailOptions, function (error, response) {
                // if you don't want to use this transport object anymore, uncomment following line
                smtpTransport.close(); // shut down the connection pool, no more messages
                callback(error);
            });
        });
    };
    return BillHelper;
})();

module.exports = BillHelper;
//# sourceMappingURL=BillHelper.js.map

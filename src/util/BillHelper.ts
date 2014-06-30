/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>

import Letter = require('./../model/Letter')
import Config = require('./../config')
import PdfInvoice = require('./pdf/invoice/PdfInvoice')
class BillHelper {
    public static sendBill(letter : Letter, fileName : string, callback: (err : Error) => void) {
        var fs = require("fs");
        var prefix = Config.getBasePath() + '/public/pdf/';
        var path = prefix + fileName;

        PdfInvoice.createInvoice(letter, function (error: Error, data: string) {
            if (error) {
                callback(error);
                return;
            }
            fs.writeFile(path, data, function(err) {
                if (err) {
                    callback(err);
                    return;
                }

                BillHelper.sendMail(letter, path, callback);
            });
        });
    }

    private static sendMail(letter: Letter, billPath: string, callback: (error: Error) => void) {
        var nodemailer = require("nodemailer");
        var jade = require('jade');
        var dateFormat = require('dateformat');

        var prettyPassedToPrintingProviderAt = dateFormat(letter.printInformation.passedToPrintingProviderAt, "shortDate");
        var prettyDispatchedByPrintingProviderAt = dateFormat(letter.printInformation.passedToPrintingProviderAt, "shortDate");

        var options = { pretty: true,
            invoiceNumber: letter.invoiceNumber,
            serverPath: Config.getBaseUri()
        };

        jade.renderFile(Config.getBasePath()  + '/views/email.jade', options, function (err, html) {
            if (err) {
                callback(err);
                return;
            }
            // create reusable transport method (opens pool of SMTP connections)
            var smtpTransport = Config.getNodemailerTransport();

            var message = "Please see the HTML Version of this email for more information.";
            // setup e-mail data with unicode symbols
            var mailOptions = {
                from: "hello@milsapp.com", // sender address
                to: letter.issuer.email, // list of receivers
                subject: "Mils Billing", // Subject line
                text: message, // plaintext body
                html: html, // html body,
                attachments : [{fileName: 'Invoice.pdf', filePath: billPath}] // TODO: Check whether this is correct
            };

            // send mail with defined transport object
            smtpTransport.sendMail(mailOptions, function(error, response){
                // if you don't want to use this transport object anymore, uncomment following line
                smtpTransport.close(); // shut down the connection pool, no more messages
                callback(error);
            });
        });
    }
}

export = BillHelper;
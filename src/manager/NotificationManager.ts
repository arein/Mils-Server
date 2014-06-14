/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
import mongo = require("mongodb")
import MongoManager = require("./MongoManager")
import Letter = require("./../model/Letter")
import MailManager = require("./MailManager")
import Config = require("./../config")

class NotificationManager {
    public notifiyCustomersOfDispatchedDocuments() {
        var mm: MailManager = new MailManager();
        mm.getPassedToProviderButNotDispatchedLetters(function (letters: Array<Letter>) {
            for (var i = 0; i < letters.length; i++) {
                var letter = letters[i];
                mm.getDispatchStatusForReference(letter.printInformation.printJobReference, function(dispatchDate: Date) {
                    // TODO: Save the letter
                    letter.printInformation.dispatchedByPrintingProvider = true;
                    letter.printInformation.dispatchedByPrintingProviderAt = dispatchDate;
                    NotificationManager.notifyCustomerViaEmail(letter);
                });
            }
        });
    }

    public static notifyCustomerViaEmail(letter: Letter) {
        var nodemailer = require("nodemailer");
        var jade = require('jade');
        var dateFormat = require('dateformat');

        var prettyPassedToPrintingProviderAt = dateFormat(letter.printInformation.passedToPrintingProviderAt, "shortDate");
        var prettyDispatchedByPrintingProviderAt = dateFormat(letter.printInformation.passedToPrintingProviderAt, "shortDate");

        var options = { pretty: true,
            destination: letter.recipient.countryIso,
            passedToPrintingProviderAt: prettyPassedToPrintingProviderAt,
            dispatchedByPrintingProviderAt: prettyDispatchedByPrintingProviderAt
        };

        jade.renderFile('./../views/dispatched_email.jade', options, function (err, html) {
            if (err) throw err;
            // create reusable transport method (opens pool of SMTP connections)
            var smtpTransport = Config.getNodemailerTransport();

            var message = "Your letter to " + letter.recipient.countryIso + " from " + prettyPassedToPrintingProviderAt + " was dispatched at " + prettyDispatchedByPrintingProviderAt;
            // setup e-mail data with unicode symbols
            var mailOptions = {
                from: "hello@milsapp.com", // sender address
                to: letter.issuer.email, // list of receivers
                subject: "Your Letter was Dispatched", // Subject line
                text: message, // plaintext body
                html: html // html body
            };

            // send mail with defined transport object
            smtpTransport.sendMail(mailOptions, function(error, response){
                // if you don't want to use this transport object anymore, uncomment following line
                smtpTransport.close(); // shut down the connection pool, no more messages
                if(error) throw err;
            });
        });
    }

    public notifyCustomerViaPushNotification(letter: Letter) {

    }
}

export = NotificationManager;
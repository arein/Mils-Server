/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
import mongo = require("mongodb")
import MongoManager = require("./MongoManager")
import Letter = require("./../model/Letter")
import Config = require("./../config")
import PdfColorInspector = require('./../util/colorinspector/PdfColorInspector')
import MailClient = require("./../util/mail/client")
import SendMailDigest = require("./../util/mail/model/SendMailDigest")
import Recipient = require("./../util/mail/model/Recipient")

class MailManager {
    /**
     * Gets the dispatch status for a given letter.
     * @param reference
     * @param callback
     */
    public static getDispatchStatusForReference(reference: String, callback: (error: Error, dispatchDate?: Date) => void) {
        var installationKey = 'MHoa7E5AidYKHkXp41pC5WKOCRoARvhxPu86UBUkifDhtJk7IQaeZR5AoTkC84AZ';
        var email = 'adr@ceseros.de';
        var docsaway = require('./../util/mail/transport/Docsaway/lib/main');

        // Request Price
        var mode : String = Config.isProd() ? "LIVE" : "TEST";
        var client = new docsaway.Client(email, installationKey, mode);
        client.getAccountInfo(reference, function(err: Error, dispatchDate: Date) {
            if (err) {
                callback(err);
            } else {
                callback(undefined, dispatchDate);
            }
        });
    }

    public static transferLetterToPrintProvider(letter: Letter, callback: (error: Error) => void) {
        var prefix = Config.getBasePath() + '/public/pdf/';
        var ci = new PdfColorInspector();
        ci.canApplyGrayscale(prefix + letter.pdf, function (isGreyscale) {
            letter.printInformation.printedInBlackWhite = isGreyscale; // Store whether the letter was printed in greyscale
            var recipient = new Recipient(letter.recipient.name, letter.recipient.address1, letter.recipient.city, letter.recipient.postalCode, letter.recipient.countryIso, letter.issuer.email, letter.recipient.company, letter.recipient.address2, letter.recipient.state);
            var mailClient = new MailClient();
            mailClient.sendMail(prefix + letter.pdf, recipient, isGreyscale, function (err:Error, digest?:SendMailDigest) {
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

                MongoManager.getDb(function(db: mongo.Db) {
                    db.collection('letter', function (err:Error, collection: mongo.Collection) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        collection.update({'_id': letter._id}, letter, {safe: true}, function (err:Error, result:number) {
                            callback(err);
                        });
                    });
                });
            });
        });
    }
}

export = MailManager;
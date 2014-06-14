/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
import mongo = require("mongodb")
import MongoManager = require("./MongoManager")
import Letter = require("./../model/Letter")
import Config = require("./../config")

class MailManager {
    public getPassedToProviderButNotDispatchedLetters(callback: (letters: Array<Letter>) => void) {
        MongoManager.getDb(function (db : mongo.Db) {
            db.collection('letter', function (err, collection) {
                if (err) throw err;
                collection.find({
                    payed: true,
                    "printInformation.passedToPrintingProvider": true,
                    '$or': [{"printInformation.dispatchedByPrintingProvider": {'$exists': false}},
                        {"printInformation.dispatchedByPrintingProvider": {'$exists': false}}]

                })
                .toArray(function (err: Error, letters:Array<Letter>) {
                    if (err) throw err;
                    callback(letters);
                });
            });
        });
    }

    public getDispatchStatusForReference(reference: String, callback: (status: any) => void) {
        var installationKey = 'MHoa7E5AidYKHkXp41pC5WKOCRoARvhxPu86UBUkifDhtJk7IQaeZR5AoTkC84AZ';
        var email = 'adr@ceseros.de';
        var docsaway = require('./../util/mail/transport/Docsaway/lib/main');

        // Request Price
        var mode : String = Config.isProd() ? "LIVE" : "TEST";
        var client = new docsaway.Client(email, installationKey, mode);
        client.getAccountInfo(reference, function(err: Error, dispatchDate: Date) {
            if (err) throw err;
            callback(dispatchDate);
        });
    }
}

export = MailManager;
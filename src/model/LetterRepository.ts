/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
import MongoManager = require("./../manager/MongoManager")
import mongo = require("mongodb")
import Letter = require("./../model/Letter")
class LetterRepository {
    /**
     * Fetches all letters that were submitted to the provider but that were not as dispatched yet.
     * @param callback
     */
    public static getPassedToProviderButNotDispatchedLetters(callback: (letters: Array<Letter>) => void) {
        MongoManager.getDb(function (db : mongo.Db) {
            db.collection('letter', function (err, collection) {
                if (err) throw err;
                collection.find({
                    payed: true,
                    "printInformation.passedToPrintingProvider": true,
                    '$or': [{"printInformation.dispatchedByPrintingProvider": false},
                        {"printInformation.dispatchedByPrintingProvider": {'$exists': false}}]

                })
                .toArray(function (err: Error, letters:Array<Letter>) {
                    if (err) throw err;
                    callback(letters);
                });
            });
        });
    }

    /**
     * Gets all letters that were payed but not yet dispatched.
     * @param callback
     */
    public static getPayedButNotTransferredToPrintingCompanyLetters(callback: (letters: Array<Letter>) => void) {
        MongoManager.getDb(function (db : mongo.Db) {
            db.collection('letter', function (err, collection) {
                if (err) throw err;
                collection.find({
                    payed: true,
                    '$or': [{"printInformation.passedToPrintingProvider": false},
                        {"printInformation.passedToPrintingProvider": {'$exists': false}}]

                })
                .toArray(function (err: Error, letters:Array<Letter>) {
                    if (err) throw err;
                    callback(letters);
                });
            });
        });
    }

    /**
     * Gets all letters that were payed for which the issuer did not receive a bill.
     * @param callback
     */
    public static getPayedButIssuedABillForLetters(callback: (letters: Array<Letter>) => void) {
        MongoManager.getDb(function (db : mongo.Db) {
            db.collection('letter', function (err, collection) {
                if (err) throw err;
                collection.find({
                    payed: true,
                    '$or': [{"billSent": false},
                            {"billSent": {'$exists': false}}]

                })
                .toArray(function (err: Error, letters:Array<Letter>) {
                    if (err) throw err;
                    callback(letters);
                });
            });
        });
    }
}

export = LetterRepository;
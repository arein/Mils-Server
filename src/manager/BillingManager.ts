/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
import mongo = require("mongodb")
import Letter = require("./../model/Letter")
import BillHelper = require("./../util/BillHelper")
import MongoManager = require("./MongoManager")
import LetterRepository = require("./../model/LetterRepository")
class BillingManager {
    /**
     * Generates and sends the bill for a given letter
     * @param letter
     * @param callback
     */
    public static generateAndSendBillForLetter(letter: Letter, callback: (error: Error) => void) {
        BillHelper.sendBill(letter, 'invoice-' + letter.pdf, function (err:Error) {
            if (err) {
                letter.billSent = false;
            } else {
                letter.billSent = true;
                letter.billSentAt = new Date();
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
    }

    public static generateAndSendUnsentBills(callback: (numberOfGeneratedAndSentBills: number, numberOfErrors: number) => void) {
        var numberOfGeneratedAndSentBills: number = 0;
        var numberOfErrors: number = 0;
        LetterRepository.getLettersWithBillsToBeSent(function (letters: Array<Letter>) {
            var conclude = function() {
                if (numberOfErrors + numberOfGeneratedAndSentBills === letters.length) {
                    callback(numberOfGeneratedAndSentBills, numberOfErrors);
                }
            };

            for (var i = 0; i < letters.length; i++) {
                var letter: Letter = letters[i];
                BillingManager.generateAndSendBillForLetter(letter, function(error: Error) {
                   if (error) {
                       console.log("An error occurred when trying to send a bill for letter " + letter._id + ":" + error.message);
                       numberOfErrors++;
                   } else {
                       numberOfGeneratedAndSentBills++;
                   }
                   conclude();
                });
            }
        });
    }
}

export = BillingManager;
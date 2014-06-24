var BillHelper = require("./../util/BillHelper");
var MongoManager = require("./MongoManager");
var LetterRepository = require("./../model/LetterRepository");
var BillingManager = (function () {
    function BillingManager() {
    }
    /**
    * Generates and sends the bill for a given letter
    * @param letter
    * @param callback
    */
    BillingManager.generateAndSendBillForLetter = function (letter, callback) {
        BillHelper.sendBill(letter, 'invoice-' + letter.pdf, function (err) {
            if (err) {
                letter.billSent = false;
            } else {
                letter.billSent = true;
                letter.billSentAt = new Date();
            }

            MongoManager.getDb(function (db) {
                db.collection('letter', function (err, collection) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    collection.update({ '_id': letter._id }, letter, { safe: true }, function (err, result) {
                        callback(err);
                    });
                });
            });
        });
    };

    BillingManager.generateAndSendUnsentBills = function (callback) {
        var numberOfGeneratedAndSentBills = 0;
        var numberOfErrors = 0;
        LetterRepository.getLettersWithBillsToBeSent(function (letters) {
            if (letters.length === 0) {
                callback(0, 0);
            }

            var conclude = function () {
                if (numberOfErrors + numberOfGeneratedAndSentBills === letters.length) {
                    callback(numberOfGeneratedAndSentBills, numberOfErrors);
                }
            };

            for (var i = 0; i < letters.length; i++) {
                var letter = letters[i];
                BillingManager.generateAndSendBillForLetter(letter, function (error) {
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
    };
    return BillingManager;
})();

module.exports = BillingManager;
//# sourceMappingURL=BillingManager.js.map

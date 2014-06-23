/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
var MongoManager = require("./../manager/MongoManager");

var LetterRepository = (function () {
    function LetterRepository() {
    }
    /**
    * Fetches all letters that were submitted to the provider but that were not as dispatched yet.
    * @param callback
    */
    LetterRepository.getPassedToProviderButNotDispatchedLetters = function (callback) {
        MongoManager.getDb(function (db) {
            db.collection('letter', function (err, collection) {
                if (err)
                    throw err;
                collection.find({
                    payed: true,
                    "printInformation.passedToPrintingProvider": true,
                    '$or': [
                        { "printInformation.dispatchedByPrintingProvider": false },
                        { "printInformation.dispatchedByPrintingProvider": { '$exists': false } }]
                }).toArray(function (err, letters) {
                    if (err)
                        throw err;
                    callback(letters);
                });
            });
        });
    };

    /**
    * Gets all letters that were payed but not yet dispatched.
    * @param callback
    */
    LetterRepository.getPayedButNotTransferredToPrintingCompanyLetters = function (callback) {
        MongoManager.getDb(function (db) {
            db.collection('letter', function (err, collection) {
                if (err)
                    throw err;
                collection.find({
                    payed: true,
                    '$or': [
                        { "printInformation.passedToPrintingProvider": false },
                        { "printInformation.passedToPrintingProvider": { '$exists': false } }]
                }).toArray(function (err, letters) {
                    if (err)
                        throw err;
                    callback(letters);
                });
            });
        });
    };

    /**
    * Gets all letters that were payed for which the issuer did not receive a bill.
    * @param callback
    */
    LetterRepository.getPayedButIssuedABillForLetters = function (callback) {
        MongoManager.getDb(function (db) {
            db.collection('letter', function (err, collection) {
                if (err)
                    throw err;
                collection.find({
                    payed: true,
                    '$or': [
                        { "billSent": false },
                        { "billSent": { '$exists': false } }]
                }).toArray(function (err, letters) {
                    if (err)
                        throw err;
                    callback(letters);
                });
            });
        });
    };
    return LetterRepository;
})();

module.exports = LetterRepository;
//# sourceMappingURL=LetterRepository.js.map

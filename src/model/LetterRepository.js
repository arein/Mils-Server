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
    * TODO: Not yet im
    * @param callback
    */
    LetterRepository.prototype.getPayedButNotDispatchedLetters = function (callback) {
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
    return LetterRepository;
})();
//# sourceMappingURL=LetterRepository.js.map

var MongoManager = require("./MongoManager");

var Config = require("./../config");

var MailManager = (function () {
    function MailManager() {
    }
    MailManager.prototype.getPassedToProviderButNotDispatchedLetters = function (callback) {
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

    MailManager.prototype.getDispatchStatusForReference = function (reference, callback) {
        var installationKey = 'MHoa7E5AidYKHkXp41pC5WKOCRoARvhxPu86UBUkifDhtJk7IQaeZR5AoTkC84AZ';
        var email = 'adr@ceseros.de';
        var docsaway = require('./../util/mail/transport/Docsaway/lib/main');

        // Request Price
        var mode = Config.isProd() ? "LIVE" : "TEST";
        var client = new docsaway.Client(email, installationKey, mode);
        client.getAccountInfo(reference, function (err, dispatchDate) {
            if (err) {
                callback(err);
            } else {
                callback(undefined, dispatchDate);
            }
        });
    };
    return MailManager;
})();

module.exports = MailManager;
//# sourceMappingURL=MailManager.js.map

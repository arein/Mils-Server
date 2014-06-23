var Config = require("./../config");

var MailManager = (function () {
    function MailManager() {
    }
    /**
    * Gets the dispatch status for a given letter.
    * @param reference
    * @param callback
    */
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

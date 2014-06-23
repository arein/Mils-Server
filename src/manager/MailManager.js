var MongoManager = require("./MongoManager");

var Config = require("./../config");
var PdfColorInspector = require('./../util/colorinspector/PdfColorInspector');
var MailClient = require("./../util/mail/client");

var Recipient = require("./../util/mail/model/Recipient");

var MailManager = (function () {
    function MailManager() {
    }
    /**
    * Gets the dispatch status for a given letter.
    * @param reference
    * @param callback
    */
    MailManager.getDispatchStatusForReference = function (reference, callback) {
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

    MailManager.transferLetterToPrintProvider = function (letter, callback) {
        var prefix = Config.getBasePath() + '/public/pdf/';
        var ci = new PdfColorInspector();
        ci.canApplyGrayscale(prefix + letter.pdf, function (isGreyscale) {
            letter.printInformation.printedInBlackWhite = isGreyscale; // Store whether the letter was printed in greyscale
            var recipient = new Recipient(letter.recipient.name, letter.recipient.address1, letter.recipient.city, letter.recipient.postalCode, letter.recipient.countryIso, letter.issuer.email, letter.recipient.company, letter.recipient.address2, letter.recipient.state);
            var mailClient = new MailClient();
            mailClient.sendMail(prefix + letter.pdf, recipient, isGreyscale, function (err, digest) {
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
        });
    };
    return MailManager;
})();

module.exports = MailManager;
//# sourceMappingURL=MailManager.js.map

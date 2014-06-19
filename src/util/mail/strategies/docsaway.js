/// <reference path='./../../../../vendor/typescript-node-definitions/node.d.ts'/>
var SendMailDigest = require('./../model/SendMailDigest');
var CalculatePriceDigest = require('./../model/CalculatePriceDigest');
var ProviderType = require('./../model/ProviderType');

var Config = require('./../../../config');
var Docsaway = (function () {
    function Docsaway() {
    }
    Docsaway.prototype.sendMail = function (filepath, recipient, printBlackWhite, callback) {
        var installationKey = 'MHoa7E5AidYKHkXp41pC5WKOCRoARvhxPu86UBUkifDhtJk7IQaeZR5AoTkC84AZ';
        var email = 'adr@ceseros.de';

        // /Users/arein/node/letterapp
        var docsaway = require('./../transport/Docsaway/lib/main');

        var data = {
            recipient: recipient,
            file: ""
        };

        var fs = require('fs');
        fs.readFile(filepath, function (err, pdf) {
            if (err) {
                callback(err);
                return;
            }
            data.file = pdf.toString('base64');
            var mode = Config.isProd() ? "LIVE" : "TEST";
            var client = new docsaway.Client(email, installationKey, mode);
            client.sendMail(data.recipient, data.file, printBlackWhite, function (error, result) {
                if (error) {
                    return callback(error, undefined);
                }
                var digest = new SendMailDigest(1 /* Docsaway */, result.transaction.reference, parseFloat(result.transaction.price));
                callback(undefined, digest);
            });
        });
    };

    Docsaway.prototype.calculatePrice = function (pages, destinationCountryIso, callback) {
        var installationKey = 'MHoa7E5AidYKHkXp41pC5WKOCRoARvhxPu86UBUkifDhtJk7IQaeZR5AoTkC84AZ';
        var email = 'adr@ceseros.de';

        // /Users/arein/node/letterapp
        var docsaway = require('./../transport/Docsaway/lib/main');

        // Request Price
        var mode = Config.isProd() ? "LIVE" : "TEST";
        var client = new docsaway.Client(email, installationKey, mode);
        client.calculatePrice(destinationCountryIso, pages, function (error, result) {
            if (error) {
                callback(error);
                return;
            }
            var priceInEur = result.price * 0.65;
            var digest = new CalculatePriceDigest(priceInEur, result.city, result.country, result.courier);
            callback(undefined, digest);
        });
    };
    return Docsaway;
})();
module.exports = Docsaway;
//# sourceMappingURL=docsaway.js.map

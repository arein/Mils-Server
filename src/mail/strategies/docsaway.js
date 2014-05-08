/// <reference path='./../../typescript-node-definitions/node.d.ts'/>
var SendMailDigest = require('./../model/SendMailDigest');
var CalculatePriceDigest = require('./../model/CalculatePriceDigest');
var ProviderType = require('./../model/ProviderType');

var Docsaway = (function () {
    function Docsaway() {
    }
    Docsaway.prototype.sendMail = function (filepath, recipient, callback) {
        var installationKey = 'HzPSxZHdY49xIeylq7S5iC7ceqB3i7sxEfmGz82zbN9euyuArzMWJ5CRqo0kapOY';
        var email = 'test-docsaway-api@ceseros.de';

        // /Users/arein/node/letterapp
        var docsaway = require('.././lib/main');

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
            var client = new docsaway.Client(email, installationKey, "TEST");
            client.sendMail(data.recipient, data.file, function (error, result) {
                var digest = new SendMailDigest(1 /* Docsaway */, result.transaction.reference);
                callback(error, digest);
            });
        });
    };

    Docsaway.prototype.calculatePrice = function (pages, destinationCountryIso, callback) {
        var installationKey = 'HzPSxZHdY49xIeylq7S5iC7ceqB3i7sxEfmGz82zbN9euyuArzMWJ5CRqo0kapOY';
        var email = 'test-docsaway-api@ceseros.de';

        // /Users/arein/node/letterapp
        var docsaway = require('.././lib/main');

        // Request Price
        var client = new docsaway.Client(email, installationKey, "TEST");
        client.calculatePrice(destinationCountryIso, pages, function (error, result) {
            if (error) {
                callback(error);
                return;
            }
            var priceInEur = result.price * 0.65 * 0.75;
            var digest = new CalculatePriceDigest(priceInEur, result.city, result.country, result.courier);
            callback(undefined, digest);
        });
    };
    return Docsaway;
})();
module.exports = Docsaway;
//# sourceMappingURL=docsaway.js.map

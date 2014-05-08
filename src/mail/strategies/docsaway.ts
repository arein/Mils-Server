/// <reference path='./../../typescript-node-definitions/node.d.ts'/>
import SendMailDigest = require('./../model/SendMailDigest');
import CalculatePriceDigest = require('./../model/CalculatePriceDigest');
import ProviderType = require('./../model/ProviderType');
import IMailStrategy = require('./IMailStrategy');
import Recipient = require('./../model/Recipient');
class Docsaway implements IMailStrategy {
    sendMail(filepath:string, recipient:Recipient, callback:(error:Error, digest?:SendMailDigest) => void) {
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
                var digest = new SendMailDigest(ProviderType.ProviderType.Docsaway, result.transaction.reference);
                callback(error, digest);
            });
        });
    }

    calculatePrice(pages:number, destinationCountryIso:string, callback:(error:Error, digest?:CalculatePriceDigest) => void) {
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
            var priceInEur = result.price * 0.65 * 0.75; // Conversion and reduced price
            var digest = new CalculatePriceDigest(priceInEur, result.city, result.country, result.courier);
            callback(undefined, digest);
        });
    }
}
export = Docsaway;
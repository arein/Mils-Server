/// <reference path='./../../../../vendor/typescript-node-definitions/node.d.ts'/>
import SendMailDigest = require('./../model/SendMailDigest');
import CalculatePriceDigest = require('./../model/CalculatePriceDigest');
import ProviderType = require('./../model/ProviderType');
import IMailStrategy = require('./IMailStrategy');
import Recipient = require('./../model/Recipient');
import Config = require('./../../../config');
class Docsaway implements IMailStrategy {
    sendMail(filepath:string, recipient:Recipient, callback:(error:Error, digest?:SendMailDigest) => void) {
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
            var mode : String = Config.isProd() ? "LIVE" : "TEST";
            var client = new docsaway.Client(email, installationKey, mode);
            client.sendMail(data.recipient, data.file, function (error, result) {
                if (error) {
                    return callback(error, undefined);
                }
                console.log("Provider: " + ProviderType.ProviderType.Docsaway);
                var digest = new SendMailDigest(ProviderType.ProviderType.Docsaway, result.transaction.reference);
                callback(undefined, digest);
            });
        });
    }

    calculatePrice(pages:number, destinationCountryIso:string, callback:(error:Error, digest?:CalculatePriceDigest) => void) {
        var installationKey = 'MHoa7E5AidYKHkXp41pC5WKOCRoARvhxPu86UBUkifDhtJk7IQaeZR5AoTkC84AZ';
        var email = 'adr@ceseros.de';
        // /Users/arein/node/letterapp
        var docsaway = require('./../transport/Docsaway/lib/main');

        // Request Price
        var mode : String = Config.isProd() ? "LIVE" : "TEST";
        var client = new docsaway.Client(email, installationKey, mode);
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
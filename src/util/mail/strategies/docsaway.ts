/// <reference path='./../../../../vendor/typescript-node-definitions/node.d.ts'/>
import SendMailDigest = require('./../model/SendMailDigest');
import CalculatePriceDigest = require('./../model/CalculatePriceDigest');
import ProviderType = require('./../model/ProviderType');
import IMailStrategy = require('./IMailStrategy');
import Recipient = require('./../model/Recipient');
import Config = require('./../../../config');
import CurrencyConverter = require('./../../../util/CurrencyConverter')
import Currency = require('./../../../util/Braintree/Model/Currency')
class Docsaway implements IMailStrategy {
    sendMail(filepath:string, recipient:Recipient, printBlackWhite: boolean, callback:(error:Error, digest?:SendMailDigest) => void) {
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
            client.sendMail(data.recipient, data.file, printBlackWhite, function (error, result) {
                if (error) {
                    return callback(error, undefined);
                }

                CurrencyConverter.convert(CurrencyConverter.convertStringToCurrencyType("AUD"), CurrencyConverter.convertStringToCurrencyType("EUR"), parseFloat(result.transaction.price), function (priceInEur: number) {
                    var digest = new SendMailDigest(ProviderType.ProviderType.Docsaway, result.transaction.reference, parseFloat(result.transaction.price), priceInEur);
                    callback(undefined, digest);
                });
            });
        });
    }

    /**
     * Calculates the Price in EUR
     *
     * @param pages
     * @param destinationCountryIso
     * @param callback
     */
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
            var digest = new CalculatePriceDigest(parseFloat(result.price), result.city, result.country, result.courier);
            callback(undefined, digest);
        });
    }
}
export = Docsaway;
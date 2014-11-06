/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
import Currency = require('./Braintree/Model/Currency')
import Config = require('./../config')
class CurrencyConverter {
    public static convert(from: Currency, to: Currency, amount: number, callback: (result: number) => void) {
        if (from == to) {
            callback(amount);
            return;
        }
        var oxr = require('open-exchange-rates'),
            fx = require('money');

        oxr.set({ app_id: Config.getCurrencyConverterAppId() });

        oxr.latest(function() {
            // Apply exchange rates and base rate to `fx` library object:
            fx.rates = oxr.rates;
            fx.base = oxr.base;

            // money.js is all set up now:
            var result = fx(amount).from(CurrencyConverter.convertCurrencyTypeToString(from)).to(CurrencyConverter.convertCurrencyTypeToString(to)); // 8.0424 or etc.
            callback(result);
        });
    }

    public static convertCurrencyTypeToString(currency: Currency) {
        switch (currency) {
            case Currency.AUD:
                return "AUD";
            case Currency.EUR:
                return "EUR";
            case Currency.GBP:
                return "GBP";
            case Currency.USD:
                return "USD";
        }
    }

    public static convertStringToCurrencyType(currency: string): Currency {
        switch (currency) {
            case "AUD":
                return Currency.AUD;
            case "EUR":
                return Currency.EUR;
            case "GBP":
                return Currency.GBP;
            case "USD":
                return Currency.USD;
        }
    }
}

export = CurrencyConverter;
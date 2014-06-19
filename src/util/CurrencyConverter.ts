/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
import Currency = require('./braintree/Model/Currency')
class CurrencyConverter {
    public static convert(from: Currency, to: Currency, amount: number, callback: (result: number) => void) {
        var oxr = require('open-exchange-rates'),
            fx = require('money');

        oxr.set({ app_id: 'c9b5a882d43146918ebe0afdd978fbe8' });

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

    public static convertStringToCurrencyType(currency: string) {
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
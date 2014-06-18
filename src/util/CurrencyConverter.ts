/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
import Currencies = require('./braintree/Model/Currencies')
class CurrencyConverter {
    public static convert(from: Currencies.Currency, to: Currencies.Currency, amount: number, callback: (result: number) => void) {
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

    public static convertCurrencyTypeToString(currency: Currencies.Currency) {
        switch (currency) {
            case Currencies.Currency.AUD:
                return "AUD";
            case Currencies.Currency.EUR:
                return "EUR";
            case Currencies.Currency.GBP:
                return "GBP";
            case Currencies.Currency.USD:
                return "USD";
        }
    }

    public static convertStringToCurrencyType(currency: string) {
        switch (currency) {
            case "AUD":
                return Currencies.Currency.AUD;
            case "EUR":
                return Currencies.Currency.EUR;
            case "GBP":
                return Currencies.Currency.GBP;
            case "USD":
                return Currencies.Currency.USD;
        }
    }
}

export = CurrencyConverter;
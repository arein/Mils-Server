/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
var Currencies = require('./braintree/Model/Currencies');
var CurrencyConverter = (function () {
    function CurrencyConverter() {
    }
    CurrencyConverter.convert = function (from, to, amount, callback) {
        var oxr = require('open-exchange-rates'), fx = require('money');

        oxr.set({ app_id: 'c9b5a882d43146918ebe0afdd978fbe8' });

        oxr.latest(function () {
            // Apply exchange rates and base rate to `fx` library object:
            fx.rates = oxr.rates;
            fx.base = oxr.base;

            // money.js is all set up now:
            var result = fx(amount).from(CurrencyConverter.convertCurrencyTypeToString(from)).to(CurrencyConverter.convertCurrencyTypeToString(to));
            callback(result);
        });
    };

    CurrencyConverter.convertCurrencyTypeToString = function (currency) {
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
    };

    CurrencyConverter.convertStringToCurrencyType = function (currency) {
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
    };
    return CurrencyConverter;
})();

module.exports = CurrencyConverter;
//# sourceMappingURL=CurrencyConverter.js.map

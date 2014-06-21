/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
var Currency = require('./Braintree/Model/Currency');
var CurrencyConverter = (function () {
    function CurrencyConverter() {
    }
    CurrencyConverter.convert = function (from, to, amount, callback) {
        if (from == to) {
            console.log("From equals to");
            callback(amount);
            return;
        }
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
            case 2 /* AUD */:
                return "AUD";
            case 0 /* EUR */:
                return "EUR";
            case 3 /* GBP */:
                return "GBP";
            case 1 /* USD */:
                return "USD";
        }
    };

    CurrencyConverter.convertStringToCurrencyType = function (currency) {
        switch (currency) {
            case "AUD":
                return 2 /* AUD */;
            case "EUR":
                return 0 /* EUR */;
            case "GBP":
                return 3 /* GBP */;
            case "USD":
                return 1 /* USD */;
        }
    };
    return CurrencyConverter;
})();

module.exports = CurrencyConverter;
//# sourceMappingURL=CurrencyConverter.js.map

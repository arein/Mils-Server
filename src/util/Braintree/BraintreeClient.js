var Currency = require('./Model/Currency');
var Config = require('./../../config');

var BraintreeHelper = (function () {
    function BraintreeHelper(sandboxed) {
        this.braintree = require("braintree");
        this.sandboxed = sandboxed;

        if (this.sandboxed) {
            this.gateway = this.braintree.connect(Config.getBraintreeSandboxConfig(this.braintree.Environment.Sandbox));
        } else {
            this.gateway = this.braintree.connect(Config.getBraintreeProductionConfig(this.braintree.Environment.Production));
        }
    }
    BraintreeHelper.prototype.isSandbox = function () {
        return this.sandboxed;
    };

    BraintreeHelper.prototype.pay = function (amount, currency, creditCard, callback) {
        var saleRequest = {
            amount: amount,
            merchantAccountId: this.getMerchantAccountIdForCurrency(currency),
            creditCard: {
                number: creditCard.number,
                cvv: creditCard.cvv,
                expirationDate: creditCard.expirationDate
            },
            options: {
                submitForSettlement: true
            }
        };

        // development only
        /*
        if ('development' == app.get('env')) {
        success("development");
        return;
        }
        */
        this.gateway.transaction.sale(saleRequest, function (err, result) {
            if (result != null && typeof result !== 'undefined' && result.success) {
                callback(undefined, result);
            } else {
                if (typeof err !== 'undefined' && err != null) {
                    callback(err);
                } else {
                    callback(new Error(result.message));
                }
            }
        });
    };

    BraintreeHelper.guessTransactionCost = function (price) {
        return parseFloat((price * 0.04641 + 0.325).toFixed(2));
    };

    BraintreeHelper.prototype.getMerchantAccountIdForCurrency = function (currency) {
        if (this.isSandbox())
            return "qw5w86564jkpbnkn";
        switch (currency) {
            case 2 /* AUD */:
                return "milsAUD";
            case 3 /* GBP */:
                return "milsGBP";
            case 1 /* USD */:
                return "milsUSD";
            default:
                return "milsEUR";
        }
    };
    return BraintreeHelper;
})();

module.exports = BraintreeHelper;
//# sourceMappingURL=BraintreeClient.js.map

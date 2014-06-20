var Currency = require('./Model/Currency');
var Config = require('./../../config');

var BraintreeHelper = (function () {
    function BraintreeHelper(sandboxed) {
        this.braintree = require("braintree");
        this.sandboxed = sandboxed;

        if (this.sandboxed) {
            this.gateway = this.braintree.connect({
                environment: this.braintree.Environment.Sandbox,
                merchantId: "7sj5c56hggvmgrfw",
                publicKey: "78rfb5jwd4877d48",
                privateKey: "333775c67b6af31779a8bc9e8c529b31"
            });
        } else {
            this.gateway = this.braintree.connect({
                environment: this.braintree.Environment.Production,
                merchantId: "krf85rj993z3mj7n",
                publicKey: "9nnsbrqv7nbvd4wq",
                privateKey: "a2e371f67b9839d5e8fd5b6685bb3a31"
            });
        }
    }
    BraintreeHelper.prototype.isSandbox = function () {
        return this.sandboxed;
    };

    BraintreeHelper.prototype.pay = function (amount, currency, creditCard, success, failure) {
        var saleRequest = {
            amount: amount,
            merchantAccountId: BraintreeHelper.getMerchantAccountIdForCurrency(currency),
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
                success(result);
            } else {
                if (typeof err !== 'undefined' && err != null) {
                    failure(err);
                } else {
                    failure(result.message);
                }
            }
        });
    };

    BraintreeHelper.guessTransactionCost = function (price) {
        return parseFloat((price * 0.04641 + 0.325).toFixed(2));
    };

    BraintreeHelper.getMerchantAccountIdForCurrency = function (currency) {
        if (!Config.isProd())
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

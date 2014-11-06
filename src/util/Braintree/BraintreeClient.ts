/// <reference path='./../../../vendor/typescript-node-definitions/node.d.ts'/>
import CreditCard = require('./Model/CreditCard');
import Currency = require('./Model/Currency')
import Config = require('./../../config')

class BraintreeHelper {
    braintree : any;
    sandboxed : boolean;
    gateway : any;
    constructor(sandboxed: boolean) {
        this.braintree = require("braintree");
        this.sandboxed = sandboxed;

        if (this.sandboxed) {
            this.gateway = this.braintree.connect(Config.getBraintreeSandboxConfig(this.braintree.Environment.Sandbox));
        } else {
            this.gateway = this.braintree.connect(Config.getBraintreeProductionConfig(this.braintree.Environment.Production));
        }
    }

    isSandbox() {
        return this.sandboxed;
    }

    pay(amount : number, currency: Currency, creditCard : CreditCard, callback: (error: Error, result?: any) => void) {

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

        this.gateway.transaction.sale(saleRequest, function (err: Error, result) {
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
    }

    public static guessTransactionCost(price: number): number {
        return parseFloat((price * 0.04641 + 0.325).toFixed(2));
    }

    public getMerchantAccountIdForCurrency(currency: Currency): string {
        if (this.isSandbox()) return "qw5w86564jkpbnkn"; // Sandbox merchant id
        switch (currency) {
            case Currency.AUD:
                return "milsAUD";
            case Currency.GBP:
                return "milsGBP";
            case Currency.USD:
                return "milsUSD";
            default:
                return "milsEUR";
        }
    }
}

// export the class
export = BraintreeHelper;
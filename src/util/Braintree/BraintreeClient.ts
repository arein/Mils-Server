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

    isSandbox() {
        return this.sandboxed;
    }

    pay(amount : number, currency: Currency, creditCard : CreditCard, callback: (error: Error, result?: any) => void) {

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

    public static getMerchantAccountIdForCurrency(currency: Currency): string {
        if (!Config.isProd()) return "qw5w86564jkpbnkn"; // Sandbox merchant id
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
/// <reference path='./../../typescript-node-definitions/node.d.ts'/>
import CreditCard = require('./Model/CreditCard');

class BraintreeHelper {
    braintree : any;
    sandboxed : boolean;
    gateway : any;
    constructor(sandboxed) {
        this.braintree = require("braintree");
        this.sandboxed = sandboxed;

        if (this.sandboxed) {
            this.gateway = this.braintree.connect({
                environment: this.braintree.Environment.Sandbox,
                merchantId: "7sj5c56hggvmgrfw",
                publicKey: "78rfb5jwd4877d48",
                privateKey: "333775c67b6af31779a8bc9e8c529b31"
            });
        }
    }

    isSandbox() {
        return this.sandboxed;
    }

    pay(amount : number, creditCard : CreditCard, success : (result : any) => void, failure : (error : Error) => void) {
        var saleRequest = {
            amount: amount,
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
    }
}

// export the class
export = BraintreeHelper;
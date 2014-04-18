class BraintreeHelper {
    braintree : object;
    sandboxed : boolean;
    gateway : object;
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

    pay(amount : number, creditCard : CreditCard, success : function() => void, failure : function () => void) {
        var saleRequest = {
            amount: amount,
            creditCard: {
                number: creditCard.number,
                cvv: creditCard.cvv,
                expirationDate: creditCard.date
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
            if (result != undefined && result.success) {
                success(result);
            } else {
                if (err != undefined) failure(err);
                failure(result.message);
            }
        });
    }
}

// export the class
exports = BraintreeHelper;
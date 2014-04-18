///<reference path='./../typescript-node-definitions/node.d.ts'/>
///<reference path='./context.ts' />
///<reference path='./policy.ts' />
///<reference path='./model/SendMailDigest.ts' />
///<reference path='./model/CalculatePriceDigest.ts' />
///<reference path='./model/Recipient.ts' />

class MailClient {
    policy:Policy;
    context:Context;

    constructor() {
        var ctx = require('./context');
        var policy = require('./policy');
        this.context = new ctx.Context();
        this.policy = new policy.Policy(this.context);
    }

    sendMail(filepath:string, recipient:Recipient, callback:(error:Error, digest?:SendMailDigest, reference?:string) => void) {
        this.policy.configure(recipient.country);
        this.context.sendMail(filepath, recipient, callback);
    }

    calculatePrice(pages:number, destination:string, callback:(error:Error, digest?:CalculatePriceDigest) => void) {
        this.policy.configure(destination);

        this.context.calculatePrice(pages, destination, function (error:Error, digest?:CalculatePriceDigest) {
            // add service charge
            if (error) {
                callback(error);
                return;
            }
            //if (preferredCurrency.toLowerCase() == 'eur') {
            if (true) {
                callback(error, digest);
            } else {
                // TODO: Convert Currency
            }
        });
    }
}

export = MailClient;
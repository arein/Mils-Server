import Policy = require('./policy');
import Recipient = require('./model/Recipient');
import SendMailDigest = require('./model/SendMailDigest');
import CalculatePriceDigest = require('./model/CalculatePriceDigest');
import Context = require('./context');
class MailClient {
    policy:Policy;
    context:Context;

    constructor() {
        this.context = new Context();
        this.policy = new Policy(this.context);
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
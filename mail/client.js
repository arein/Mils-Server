///<reference path='./../typescript-node-definitions/node.d.ts'/>
///<reference path='./context.ts' />
///<reference path='./policy.ts' />
///<reference path='./model/SendMailDigest.ts' />
///<reference path='./model/CalculatePriceDigest.ts' />
///<reference path='./model/Recipient.ts' />
var MailClient = (function () {
    function MailClient() {
        var ctx = require('./context');
        var policy = require('./policy');
        this.context = new ctx.Context();
        this.policy = new policy.Policy(this.context);
    }
    MailClient.prototype.sendMail = function (filepath, recipient, callback) {
        this.policy.configure(recipient.country);
        this.context.sendMail(filepath, recipient, callback);
    };

    MailClient.prototype.calculatePrice = function (pages, destination, callback) {
        this.policy.configure(destination);

        this.context.calculatePrice(pages, destination, function (error, digest) {
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
    };
    return MailClient;
})();
//# sourceMappingURL=client.js.map

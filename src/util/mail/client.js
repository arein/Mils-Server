var Policy = require('./policy');

var Context = require('./context');
var MailClient = (function () {
    function MailClient() {
        this.context = new Context();
        this.policy = new Policy(this.context);
    }
    MailClient.prototype.sendMail = function (filepath, recipient, printBlackWhite, callback) {
        this.policy.configure(recipient.country);
        this.context.sendMail(filepath, recipient, printBlackWhite, callback);
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

module.exports = MailClient;
//# sourceMappingURL=client.js.map

/// <reference path='./model/SendMailDigest.ts' />
/// <reference path='./model/Recipient.ts' />
/// <reference path='./strategies/IMailStrategy.ts' />
var Context = (function () {
    function Context() {
    }
    Object.defineProperty(Context.prototype, "mailStrategy", {
        set: function (newMailStrategy) {
            this.mailStrategy = newMailStrategy;
        },
        enumerable: true,
        configurable: true
    });

    Context.prototype.sendMail = function (filepath, recipient, callback) {
        this.mailStrategy.sendMail(filepath, recipient, callback);
    };

    Context.prototype.calculatePrice = function (pages, destination, callback) {
        this.mailStrategy.calculatePrice(pages, destination, callback);
    };
    return Context;
})();

// export the class
exports.Context = Context;
//# sourceMappingURL=context.js.map

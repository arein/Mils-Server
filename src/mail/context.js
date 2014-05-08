var Context = (function () {
    function Context() {
    }
    Object.defineProperty(Context.prototype, "mailStrategy", {
        set: function (newMailStrategy) {
            this._mailStrategy = newMailStrategy;
        },
        enumerable: true,
        configurable: true
    });

    Context.prototype.sendMail = function (filepath, recipient, callback) {
        this._mailStrategy.sendMail(filepath, recipient, callback);
    };

    Context.prototype.calculatePrice = function (pages, destination, callback) {
        this._mailStrategy.calculatePrice(pages, destination, callback);
    };
    return Context;
})();

module.exports = Context;
//# sourceMappingURL=context.js.map

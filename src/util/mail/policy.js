var Docsaway = require('./strategies/docsaway');

var Policy = (function () {
    function Policy(theContext) {
        this.theContext = theContext;
        this.context = theContext;
    }
    Policy.prototype.configure = function (destinationCountry) {
        switch (destinationCountry.toLowerCase()) {
            default:
                this.context.mailStrategy = new Docsaway();
                break;
        }
    };
    return Policy;
})();

module.exports = Policy;
//# sourceMappingURL=policy.js.map

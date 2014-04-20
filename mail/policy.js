var Docsaway = require('./strategies/docsaway');
var SmsKaufen = require('./strategies/sms_kaufen');
var Policy = (function () {
    function Policy(theContext) {
        this.theContext = theContext;
        this.context = theContext;
    }
    Policy.prototype.configure = function (destinationCountry) {
        //if (destinationCountry.toLowerCase() == 'de')
        if (false) {
            this.context.mailStrategy = new SmsKaufen();
        } else {
            this.context.mailStrategy = new Docsaway();
        }
    };
    return Policy;
})();

module.exports = Policy;
//# sourceMappingURL=policy.js.map

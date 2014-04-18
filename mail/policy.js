///<reference path='./../typescript-node-definitions/node.d.ts'/>
///<reference path='./context.ts' />
var Policy = (function () {
    function Policy(theContext) {
        this.theContext = theContext;
        this.context = theContext;
    }
    Policy.prototype.configure = function (destinationCountry) {
        //if (destinationCountry.toLowerCase() == 'de')
        if (false) {
            var sk = require('./strategies/sms_kaufen');
            this.context.mailStrategy = new sk.SmsKaufen();
        } else {
            var da = require('./strategies/docsaway');
            this.context.mailStrategy = new da.Docsaway();
        }
    };
    return Policy;
})();

// export the class
exports.Policy = Policy;
//# sourceMappingURL=policy.js.map

var Docsaway = require('./strategies/docsaway');
var SmsKaufen = require('./strategies/sms_kaufen');
var Lob = require('./strategies/lob');
var Ezgram = require('./strategies/ezgram');
var Postful = require('./strategies/postful');
var Policy = (function () {
    function Policy(theContext) {
        this.theContext = theContext;
        this.context = theContext;
    }
    Policy.prototype.configure = function (destinationCountry) {
        switch (destinationCountry.toLowerCase()) {
            case "de":
            case "at":
            case "ch":
                this.context.mailStrategy = new SmsKaufen();
                break;
            case "us":
            case "ca":
            case "mx":
                this.context.mailStrategy = new Lob();
                break;
            case "nl":
            case "be":
            case "fr":
                this.context.mailStrategy = new Ezgram();
                break;
            case "cn":
            case "sg":
            case "jp":
                this.context.mailStrategy = new Postful();
                break;
            default:
                this.context.mailStrategy = new Docsaway();
                break;
        }
    };
    return Policy;
})();

module.exports = Policy;
//# sourceMappingURL=policy.js.map

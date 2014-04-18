///<reference path='./../typescript-node-definitions/node.d.ts'/>
///<reference path='./context.ts' />
class Policy {
    context: Context;
    constructor(public theContext) {
        this.context = theContext;
    }
    configure(destinationCountry : string) {
        //if (destinationCountry.toLowerCase() == 'de')
        if (false) // currently not possible
        {
            var sk = require('./strategies/sms_kaufen');
            this.context.mailStrategy = new sk.SmsKaufen();
        }
        else
        {
            var da = require('./strategies/docsaway');
            this.context.mailStrategy = new da.Docsaway();
        }
    }
}

// export the class
exports.Policy = Policy;
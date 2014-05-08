/// <reference path='./../typescript-node-definitions/node.d.ts'/>
import Context = require('./context');
import Docsaway = require('./strategies/docsaway');
import SmsKaufen = require('./strategies/sms_kaufen');
class Policy {
    context: Context;

    constructor(public theContext) {
        this.context = theContext;
    }

    configure(destinationCountry:string) {
        //if (destinationCountry.toLowerCase() == 'de')
        if (false) // currently not possible
        {
            this.context.mailStrategy = new SmsKaufen();
        }
        else {
            this.context.mailStrategy = new Docsaway();
        }
    }
}

export = Policy;
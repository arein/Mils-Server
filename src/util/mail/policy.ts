/// <reference path='./../../../vendor/typescript-node-definitions/node.d.ts'/>
import Context = require('./context')
import Docsaway = require('./strategies/docsaway')
import SmsKaufen = require('./strategies/sms_kaufen')
import Lob = require('./strategies/lob')
import Ezgram = require('./strategies/ezgram')
import Postful = require('./strategies/postful')
class Policy {
    context: Context;

    constructor(public theContext) {
        this.context = theContext;
    }

    configure(destinationCountry:string) {
        switch  (destinationCountry.toLowerCase()) {
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
    }
}

export = Policy;
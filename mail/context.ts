import Recipient = require('./model/Recipient');
import SendMailDigest = require('./model/SendMailDigest');
import CalculatePriceDigest = require('./model/CalculatePriceDigest');
import IMailStrategy = require('./strategies/IMailStrategy');
class Context {
    private _mailStrategy : IMailStrategy;
    set mailStrategy(newMailStrategy:IMailStrategy) {
        this._mailStrategy = newMailStrategy;
    }

    sendMail(filepath:string, recipient:Recipient, callback:(error:Error, digest?:SendMailDigest) => void) {
        this._mailStrategy.sendMail(filepath, recipient, callback);
    }

    calculatePrice(pages:number, destination:string, callback:(error:Error, digest?:CalculatePriceDigest) => void) {
        this._mailStrategy.calculatePrice(pages, destination, callback);
    }
}

export = Context;
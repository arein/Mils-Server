import Recipient = require('./../model/Recipient');
import SendMailDigest = require('./../model/SendMailDigest');
import CalculatePriceDigest = require('./../model/CalculatePriceDigest');
interface IMailStrategy {
    sendMail(filepath:string, recipient:Recipient, callback:(error:Error, digest?:SendMailDigest) => void);
    calculatePrice(pages:number, destinationCountryIso:string, callback:(error:Error, digest?:CalculatePriceDigest) => void);
}

export = IMailStrategy
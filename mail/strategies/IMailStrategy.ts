///<reference path='./../../typescript-node-definitions/node.d.ts'/>
///<reference path='./../model/Recipient.ts' />
///<reference path='./../model/SendMailDigest.ts' />
///<reference path='./../model/CalculatePriceDigest.ts' />
interface IMailStrategy {
    sendMail(filepath : string, recipient : Recipient, callback : (error : Error, digest?: SendMailDigest) => void);
    calculatePrice(pages : number, destinationCountryIso : string, callback : (error : Error, digest? : CalculatePriceDigest) => void);
}
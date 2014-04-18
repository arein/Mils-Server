/// <reference path='./model/SendMailDigest.ts' />
/// <reference path='./model/Recipient.ts' />
/// <reference path='./strategies/IMailStrategy.ts' />
class Context {

    set mailStrategy(newMailStrategy : IMailStrategy) {
        this.mailStrategy = newMailStrategy;
    }

    sendMail(filepath: string, recipient: Recipient, callback : (error : Error, digest?: SendMailDigest) => void) {
        this.mailStrategy.sendMail(filepath, recipient, callback);
    }

    calculatePrice(pages : number, destination : string, callback : (error : Error, digest? : CalculatePriceDigest) => void) {
        this.mailStrategy.calculatePrice(pages, destination, callback);
    }
}

// export the class
exports.Context = Context;
/// <reference path='./../typescript-node-definitions/mongodb.d.ts'/>
import mongo = require("mongodb");
import Issuer = require("./Issuer");
import Recipient = require("./Recipient");
import PrintInformation = require("./PrintInformation");

class Letter {
    _id : mongo.ObjectID;
    billSent: boolean;
    billSentAt: Date;
    printInformation: PrintInformation;
    issuer: Issuer;
    recipient: Recipient;
    invoiceNumber: string;
    price: number;
    printingCost: number;
    net: number;
    vat: number;
    margin: number;
    creditCardCost: number;
    pageCount: number;
    payed: boolean;
    sandboxPurchase: boolean;
    pdf: string;
    dispatched : boolean;
    dispatchedAt : Date;
    pdfId: string;
    purchaseDate: Date;
    transactionId: string;
    vatIncome: number;
    createdAt: Date;
    updatedAt: Date;

    constructor() {
        this.issuer = new Issuer();
        this.recipient = new Recipient();
        this.printInformation = new PrintInformation();
    }
}

export = Letter;
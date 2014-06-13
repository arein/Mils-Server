/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
import mongo = require("mongodb");
import Issuer = require("./Issuer");
import Recipient = require("./Recipient");
import PrintInformation = require("./PrintInformation");
import TransactionInformation = require("./TransactionInformation");
import FinancialInformation = require("./FinancialInformation");

class Letter {
    _id : mongo.ObjectID;
    billSent: boolean;
    billSentAt: Date;
    printInformation: PrintInformation;
    transactionInformation: TransactionInformation;
    financialInformation: FinancialInformation;
    issuer: Issuer;
    recipient: Recipient;
    invoiceNumber: number;
    pageCount: number;
    payed: boolean;
    pdf: string;
    createdAt: Date;
    updatedAt: Date;

    constructor() {
        this.issuer = new Issuer();
        this.recipient = new Recipient();
        this.printInformation = new PrintInformation();
        this.financialInformation = new FinancialInformation();
        this.transactionInformation = new TransactionInformation();
    }
}

export = Letter;
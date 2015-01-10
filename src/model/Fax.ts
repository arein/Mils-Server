/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
import mongo = require("mongodb");
import Issuer = require("./Issuer");
import Recipient = require("./LetterRecipient");
import PrintInformation = require("./PrintInformation");
import TransactionInformation = require("./TransactionInformation");
import FinancialInformation = require("./FinancialInformation");
import Client = require('Client')

class Fax {
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
    devices: Array<Client>;

    constructor() {
        this.payed = false;
        this.billSent = false;
        this.issuer = new Issuer();
        this.financialInformation = new FinancialInformation();
        this.transactionInformation = new TransactionInformation();
        this.devices = [];
    }
}

export = Fax;
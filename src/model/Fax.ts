/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
import mongo = require("mongodb");
import Issuer = require("./Issuer");
import FaxRecipient = require("./FaxRecipient");
import TransactionInformation = require("./TransactionInformation");
import FinancialInformation = require("./FinancialInformation");
import Client = require('Client')

class Fax {
    _id : mongo.ObjectID;
    billSent: boolean;
    billSentAt: Date;
    transactionInformation: TransactionInformation;
    financialInformation: FinancialInformation;
    issuer: Issuer;
    recipient: FaxRecipient;
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
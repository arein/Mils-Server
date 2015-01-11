/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
import FaxRecipient = require("./FaxRecipient");
import AbstractSendable = require('./AbstractSendable')

class Fax extends AbstractSendable {
    recipient: FaxRecipient;

    constructor() {
        super();
        this.recipient = new FaxRecipient();
    }
}

export = Fax;
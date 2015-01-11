/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
import LetterRecipient = require("./LetterRecipient");
import AbstractSendable = require('./AbstractSendable');
import PrintInformation = require("./PrintInformation");

class Letter extends AbstractSendable {
    recipient: LetterRecipient;
    printInformation: PrintInformation;

    constructor() {
        super();
        this.recipient = new LetterRecipient();
        this.printInformation = new PrintInformation();
    }
}

export = Letter;
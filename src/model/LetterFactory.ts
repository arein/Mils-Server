/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/express3.d.ts'/>
import Letter = require('./Letter')
import express = require("express3")
class LetterFactory {
    public static createLetterFromRequest(req: express.Request) {
        var sanitize = require('validator').sanitize;
        var letter = new Letter();
        letter.createdAt = new Date();
        letter.updatedAt = new Date();
        letter.printInformation.passedToPrintingProvider = false;
        letter.billSent = false;
        letter.recipient.name = sanitize(req.body.recipientName).escape();
        letter.recipient.company = (typeof req.body.recipientCompany === 'undefined') ? undefined : sanitize(req.body.recipientCompany).escape();
        letter.recipient.address1 = sanitize(req.body.recipientAddress1).escape();
        letter.recipient.address2 = (typeof req.body.recipientAddress2 === 'undefined') ? undefined : sanitize(req.body.recipientAddress2).escape();
        letter.recipient.city = sanitize(req.body.recipientCity).escape();
        letter.recipient.postalCode = sanitize(req.body.recipientPostalCode).escape();
        letter.recipient.countryIso = (typeof req.body.recipientCountryIso === 'undefined') ? undefined : sanitize(req.body.recipientCountryIso).escape();

        return letter;
    }
}

export = LetterFactory;
/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/express3.d.ts'/>
import express = require("express3")
class UploadValidator {
    public static validate(req: express.Request) {
        var check = require('validator').check,
            sanitize = require('validator').sanitize;

        check(req.body.pdf).notNull();
        check(req.body.recipientName).notNull();
        check(req.body.recipientAddress1).notNull();
        check(req.body.recipientCity).notNull();
        check(req.body.recipientPostalCode).notNull();
        var iso = req.body.recipientCountryIso;
        var name = req.body.recipientName;
        var company = req.body.recipientCompany;
        var address1 = req.body.recipientAddress1;
        var address2 = req.body.recipientAddress2;
        var city = req.body.recipientCity;
        var state = req.body.recipientState;
        var zip = req.body.recipientPostalCode;

        if (name.length > 50) throw  new Error("The LetterRecipient Name may not be longer than 50 characters");
        if (company != null && typeof company !== 'undefined' && company.length > 50) throw  new Error("The LetterRecipient Company may not be longer than 50 characters");
        if (address1.length > 50) throw  new Error("The LetterRecipient Address Line 1 may not be longer than 50 characters");
        if (address2 != null && typeof address2 !== 'undefined' && address2.length > 50) throw  new Error("The LetterRecipient Address Line 2 may not be longer than 50 characters");
        if (city.length > 50) throw  new Error("The LetterRecipient City may not be longer than 50 characters");
        if (state != null && typeof state !== 'undefined' && state.length > 50) throw  new Error("The LetterRecipient State may not be longer than 50 characters");
        if (zip.length > 50) throw  new Error("The LetterRecipient Zip may not be longer than 50 characters");

        // Sanitize
        req.body.recipientName = sanitize(req.body.recipientName).trim();
        req.body.recipientName = sanitize(req.body.recipientName).escape();
        req.body.recipientName = req.body.recipientName.replace("'", '').replace('"', '');

        req.body.recipientCompany = (typeof req.body.recipientCompany === 'undefined') ? undefined : sanitize(req.body.recipientCompany).trim();
        req.body.recipientCompany = (typeof req.body.recipientCompany === 'undefined') ? undefined : sanitize(req.body.recipientCompany).escape();
        req.body.recipientCompany = (typeof req.body.recipientCompany === 'undefined') ? undefined : req.body.recipientCompany.replace("'", '').replace('"', '');

        req.body.recipientAddress1 = sanitize(req.body.recipientAddress1).trim();
        req.body.recipientAddress1 = sanitize(req.body.recipientAddress1).escape();
        req.body.recipientAddress1 = req.body.recipientAddress1.replace("'", '').replace('"', '');

        req.body.recipientAddress2 = (typeof req.body.recipientAddress2 === 'undefined') ? undefined : sanitize(req.body.recipientAddress2).trim();
        req.body.recipientAddress2 = (typeof req.body.recipientAddress2 === 'undefined') ? undefined : sanitize(req.body.recipientAddress2).escape();
        req.body.recipientAddress2 = (typeof req.body.recipientAddress2 === 'undefined') ? undefined : req.body.recipientAddress2.replace("'", '').replace('"', '');

        req.body.recipientPostalCode = sanitize(req.body.recipientPostalCode).trim();
        req.body.recipientPostalCode = sanitize(req.body.recipientPostalCode).escape();
        req.body.recipientPostalCode = req.body.recipientPostalCode.replace("'", '').replace('"', '');

        req.body.recipientCity = sanitize(req.body.recipientCity).trim();
        req.body.recipientCity = sanitize(req.body.recipientCity).escape();
        req.body.recipientCity = req.body.recipientCity.replace("'", '').replace('"', '');

        req.body.recipientCountryIso = (typeof req.body.recipientCountryIso === 'undefined') ? undefined : sanitize(req.body.recipientCountryIso).escape();
    }
}

export = UploadValidator;
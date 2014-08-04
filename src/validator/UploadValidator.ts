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
        check(req.body.recipientCountryIso).notNull();
        if (req.body.recipientName.length > 50) throw  new Error("The Recipient Name may not be longer than 50 characters");
        if (req.body.recipientCompany.length > 50) throw  new Error("The Recipient Company may not be longer than 50 characters");
        if (req.body.recipientAddress1.length > 50) throw  new Error("The Recipient Address Line 1 may not be longer than 50 characters");
        if (req.body.recipientAddress2.length > 50) throw  new Error("The Recipient Address Line 2 may not be longer than 50 characters");
        if (req.body.recipientCity.length > 50) throw  new Error("The Recipient City may not be longer than 50 characters");
        if (req.body.recipientState.length > 50) throw  new Error("The Recipient State may not be longer than 50 characters");
        if (req.body.recipientPostalCode.length > 50) throw  new Error("The Recipient Zip may not be longer than 50 characters");
    }
}

export = UploadValidator;
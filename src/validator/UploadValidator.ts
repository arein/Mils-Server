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
    }
}

export = UploadValidator;
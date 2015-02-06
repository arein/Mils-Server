/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/express3.d.ts'/>
import express = require("express3")
class PurchaseValidator {
    public static validate(req: express.Request) {
        var check = require('validator').check,
            sanitize = require('validator').sanitize;

        check(req.params.id).notNull();
        if (req.params.id.length !== 24) throw new Error("The ID Provided is not Correct");
        check(req.body).notNull();
        check(req.body.emailAddress).notNull().isEmail();
        check(req.body.address).notNull();
        check(req.body.creditCard).notNull();
        check(req.body.creditCard.number).notNull();
        req.body.creditCard.type = undefined; // we do not need this input
        check(req.body.creditCard.cvv).notNull();
        check(req.body.creditCard.date).notNull();
        check(req.body.address.name).notNull();
        check(req.body.address.line1).notNull();
        check(req.body.address.postalCode).notNull();
        check(req.body.address.city).notNull();
        check(req.body.address.country).notNull();
    }
}

export = PurchaseValidator;
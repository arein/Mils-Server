/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/express3.d.ts'/>
import Fax = require('./Fax')
import express = require("express3")
class FaxFactory {
    public static createFaxFromRequest(req: express.Request) {
        var fax = new Fax();
        fax.createdAt = new Date();
        fax.updatedAt = new Date();
        fax.billSent = false;
        fax.recipient.faxNumber = req.body.faxNumber;

        return fax;
    }
}

export = FaxFactory;
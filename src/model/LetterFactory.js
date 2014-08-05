/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/express3.d.ts'/>
var Letter = require('./Letter');

var LetterFactory = (function () {
    function LetterFactory() {
    }
    LetterFactory.createLetterFromRequest = function (req) {
        var sanitize = require('validator').sanitize;
        var letter = new Letter();
        letter.createdAt = new Date();
        letter.updatedAt = new Date();
        letter.printInformation.passedToPrintingProvider = false;
        letter.billSent = false;
        letter.recipient.name = req.body.recipientName;
        letter.recipient.company = req.body.recipientCompany;
        letter.recipient.address1 = req.body.recipientAddress1;
        letter.recipient.address2 = req.body.recipientAddress2;
        letter.recipient.city = req.body.recipientCity;
        letter.recipient.postalCode = req.body.recipientPostalCode;
        letter.recipient.countryIso = req.body.recipientCountryIso;

        return letter;
    };
    return LetterFactory;
})();

module.exports = LetterFactory;
//# sourceMappingURL=LetterFactory.js.map

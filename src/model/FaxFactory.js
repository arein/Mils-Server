/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
/// <reference path='./../../vendor/typescript-node-definitions/express3.d.ts'/>
var Fax = require('./Fax');

var FaxFactory = (function () {
    function FaxFactory() {
    }
    FaxFactory.createFaxFromRequest = function (req) {
        var fax = new Fax();
        fax.createdAt = new Date();
        fax.updatedAt = new Date();
        fax.billSent = false;
        fax.recipient.faxNumber = req.body.faxNumber;

        return fax;
    };
    return FaxFactory;
})();

module.exports = FaxFactory;
//# sourceMappingURL=FaxFactory.js.map

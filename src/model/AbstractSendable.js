var Issuer = require("./Issuer");
var TransactionInformation = require("./TransactionInformation");
var FinancialInformation = require("./FinancialInformation");

var AbstractSendable = (function () {
    function AbstractSendable() {
        this.payed = false;
        this.billSent = false;
        this.issuer = new Issuer();
        this.financialInformation = new FinancialInformation();
        this.transactionInformation = new TransactionInformation();
        this.devices = [];
    }
    return AbstractSendable;
})();

module.exports = AbstractSendable;
//# sourceMappingURL=AbstractSendable.js.map

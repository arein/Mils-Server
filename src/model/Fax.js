var Issuer = require("./Issuer");

var TransactionInformation = require("./TransactionInformation");
var FinancialInformation = require("./FinancialInformation");

var Fax = (function () {
    function Fax() {
        this.payed = false;
        this.billSent = false;
        this.issuer = new Issuer();
        this.financialInformation = new FinancialInformation();
        this.transactionInformation = new TransactionInformation();
        this.devices = [];
    }
    return Fax;
})();

module.exports = Fax;
//# sourceMappingURL=Fax.js.map

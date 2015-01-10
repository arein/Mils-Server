var Issuer = require("./Issuer");
var LetterRecipient = require("./LetterRecipient");
var PrintInformation = require("./PrintInformation");
var TransactionInformation = require("./TransactionInformation");
var FinancialInformation = require("./FinancialInformation");

var Letter = (function () {
    function Letter() {
        this.payed = false;
        this.billSent = false;
        this.issuer = new Issuer();
        this.recipient = new LetterRecipient();
        this.printInformation = new PrintInformation();
        this.financialInformation = new FinancialInformation();
        this.transactionInformation = new TransactionInformation();
        this.devices = [];
    }
    return Letter;
})();

module.exports = Letter;
//# sourceMappingURL=Letter.js.map

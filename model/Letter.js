var Issuer = require("./Issuer");
var Recipient = require("./Recipient");
var PrintInformation = require("./PrintInformation");

var Letter = (function () {
    function Letter() {
        this.issuer = new Issuer();
        this.recipient = new Recipient();
        this.printInformation = new PrintInformation();
    }
    return Letter;
})();

module.exports = Letter;
//# sourceMappingURL=Letter.js.map

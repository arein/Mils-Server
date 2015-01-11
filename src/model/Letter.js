var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
var LetterRecipient = require("./LetterRecipient");
var AbstractSendable = require('./AbstractSendable');
var PrintInformation = require("./PrintInformation");

var Letter = (function (_super) {
    __extends(Letter, _super);
    function Letter() {
        _super.call(this);
        this.recipient = new LetterRecipient();
        this.printInformation = new PrintInformation();
    }
    return Letter;
})(AbstractSendable);

module.exports = Letter;
//# sourceMappingURL=Letter.js.map

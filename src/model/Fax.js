var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
var FaxRecipient = require("./FaxRecipient");
var AbstractSendable = require('./AbstractSendable');

var Fax = (function (_super) {
    __extends(Fax, _super);
    function Fax() {
        _super.call(this);
        this.recipient = new FaxRecipient();
    }
    return Fax;
})(AbstractSendable);

module.exports = Fax;
//# sourceMappingURL=Fax.js.map

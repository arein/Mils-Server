var BillHelper = require("./../util/BillHelper");
var BillingManager = (function () {
    function BillingManager() {
    }
    BillingManager.generateAndSendBillForLetter = function (letter, callback) {
        BillHelper.sendBill(letter, 'invoice-' + letter.pdf, function (err) {
            callback(error);
        });
    };

    BillingManager.generateAndSendUnsentBills = function (callback) {
        // TODO: Implementation
    };
    return BillingManager;
})();
//# sourceMappingURL=BillingManager.js.map

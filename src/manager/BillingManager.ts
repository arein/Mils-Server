import Letter = require("./../model/Letter")
import BillHelper = require("./../util/BillHelper")
class BillingManager {
    public static generateAndSendBillForLetter(letter: Letter, callback: (error: Error) => void) {
        BillHelper.sendBill(letter, 'invoice-' + letter.pdf, function (err:Error) {
            callback(error);
        });
    }

    public static generateAndSendUnsentBills(callback: (numberOfGeneratedAndSentBills: number, numberOfErrors: number) => void) {
        // TODO: Implementation
    }
}
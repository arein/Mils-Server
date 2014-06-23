var BillingManager = require("./../manager/BillingManager");

BillingManager.generateAndSendUnsentBills(function (numberOfSuccesses, numberOfErrors) {
    console.log("%s letters dispatched, %s errors", numberOfSuccesses, numberOfErrors);
    if (numberOfErrors > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
});
//# sourceMappingURL=SendUnsentBills.js.map

var NotificationManager = require("./../manager/NotificationManager");

var nm = new NotificationManager();
nm.notifiyCustomersOfDispatchedDocuments(function (numberOfDispatchedLetters, numberOfDispatchErrors) {
    console.log("%s letters dispatched, %s errors", numberOfDispatchedLetters, numberOfDispatchErrors);
    if (numberOfDispatchErrors > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
});
//# sourceMappingURL=SendUnsentBills.js.map

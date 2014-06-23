import Letter = require("./../model/Letter")
import MailManager = require("./../manager/MailManager")
import NotificationManager = require("./../manager/NotificationManager")

NotificationManager.notifiyCustomersOfDispatchedDocuments(function(numberOfDispatchedLetters, numberOfDispatchErrors) {
    console.log("%s letters dispatched, %s errors", numberOfDispatchedLetters, numberOfDispatchErrors);
    if (numberOfDispatchErrors > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
});
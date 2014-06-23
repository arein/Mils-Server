import Letter = require("./../model/Letter")
import MailManager = require("./../manager/MailManager")

MailManager.transferUntransferredLettersToProviders(function(numberOfSuccesses, numberOfErrors) {
    console.log("%s letters dispatched, %s errors", numberOfSuccesses, numberOfErrors);
    if (numberOfErrors > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
});
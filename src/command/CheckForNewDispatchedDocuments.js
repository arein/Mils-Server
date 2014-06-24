var NotificationManager = require("./../manager/NotificationManager");

var program = require('commander');

program.version('1.0.0').option('-v, --verbose', 'A little conversation please').option('-mv, --magicverbose', 'A little conversation please').parse(process.argv);

NotificationManager.notifiyCustomersOfDispatchedDocuments(function (numberOfDispatchedLetters, numberOfDispatchErrors) {
    if (program.verbose) {
        console.log("%s letters dispatched, %s errors", numberOfDispatchedLetters, numberOfDispatchErrors);
    } else if (program.magicverbose && (numberOfDispatchedLetters > 0 || numberOfDispatchErrors > 0)) {
        console.log("%s letters dispatched, %s errors", numberOfDispatchedLetters, numberOfDispatchErrors);
    }

    if (numberOfDispatchErrors > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
});
//# sourceMappingURL=CheckForNewDispatchedDocuments.js.map

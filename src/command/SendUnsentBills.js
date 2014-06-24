var BillingManager = require("./../manager/BillingManager");

var program = require('commander');

program.version('1.0.0').option('-v, --verbose', 'A little conversation please').option('-mv, --magicverbose', 'A little conversation please').parse(process.argv);

BillingManager.generateAndSendUnsentBills(function (numberOfSuccesses, numberOfErrors) {
    if (program.verbose) {
        console.log("%s letters unsent bills sent, %s errors", numberOfSuccesses, numberOfErrors);
    } else if (program.magicverbose && (numberOfSuccesses > 0 || numberOfErrors > 0)) {
        console.log("%s letters unsent bills sent, %s errors", numberOfSuccesses, numberOfErrors);
    }

    if (numberOfErrors > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
});
//# sourceMappingURL=SendUnsentBills.js.map

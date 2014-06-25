var MailManager = require("./../manager/MailManager");

var program = require('commander');

program.version('1.0.0').option('-v, --verbose', 'A little conversation please').option('-mv, --magicverbose', 'A little conversation please').parse(process.argv);

MailManager.transferUntransferredLettersToProviders(function (numberOfSuccesses, numberOfErrors) {
    if (program.verbose) {
        console.log("%s untransferred letters transferred, %s errors", numberOfSuccesses, numberOfErrors);
    } else if (program.magicverbose && (numberOfSuccesses > 0 || numberOfErrors > 0)) {
        console.log("%s untransferred letters transferred, %s errors", numberOfSuccesses, numberOfErrors);
    }

    if (numberOfErrors > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
});
//# sourceMappingURL=TransferUntransferredLetters.js.map
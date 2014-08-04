import Letter = require("./../model/Letter")
import MailManager = require("./../manager/MailManager")

var program = require('commander');

program
    .version('1.0.0')
    .option('-v, --verbose', 'A little conversation please')
    .option('-mv, --magicverbose', 'A little conversation please')
    .parse(process.argv);

MailManager.transferUntransferredLettersToProviders(function(numberOfSuccesses: number, errors: Array<Error>) {
    if (program.verbose) {
        console.log("%s untransferred letters transferred, %s errors", numberOfSuccesses, errors.length);
        if (errors.length > 0) {
            for (var i = 0; i < errors.length; i++) {
                console.log("Error " + i + ": " + errors[i].name + ", " + errors[i].message);
            }
        }
    } else if (program.magicverbose && (numberOfSuccesses > 0 || errors.length > 0)) {
        console.log("%s untransferred letters transferred, %s errors", numberOfSuccesses, errors.length);
        if (errors.length > 0) {
            for (var i = 0; i < errors.length; i++) {
                console.log("Error " + i + ": " + errors[i].name + ", " + errors[i].message);
            }
        }
    }

    if (errors.length > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
});
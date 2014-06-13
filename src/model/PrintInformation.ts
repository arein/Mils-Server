import ProviderType = require('./../util/mail/model/ProviderType')
class PrintInformation {
    courier: string;
    city: string;
    country: string;
    provider: ProviderType.ProviderType;
    printJobReference: string;
    passedToPrintingProvider: boolean;
    passedToPrintingProviderAt: Date;
    dispatchedByPrintingProvider: boolean;
    dispatchedByPrintingProviderAt: Date;
}

export = PrintInformation;
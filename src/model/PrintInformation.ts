import ProviderType = require('./../util/mail/model/ProviderType')
class PrintInformation {
    courier: string;
    city: string;
    country: string;
    provider: ProviderType.ProviderType;
}

export = PrintInformation;
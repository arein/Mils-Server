import ProviderType = require('./ProviderType');
class SendMailDigest {
    provider : ProviderType.ProviderType;
    reference : string;
    priceInAud: number;
    priceInEur: number;
    constructor(provider : ProviderType.ProviderType, reference : string, priceInAud: number, priceInEur: number) {
        this.provider = provider;
        this.reference = reference;
        this.priceInAud = priceInAud;
        this.priceInEur = priceInEur;
    }
}

export = SendMailDigest;
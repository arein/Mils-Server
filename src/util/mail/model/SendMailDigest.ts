import ProviderType = require('./ProviderType');
class SendMailDigest {
    provider : ProviderType.ProviderType;
    reference : string;
    price: number;
    constructor(provider : ProviderType.ProviderType, reference : string, price: number) {
        this.provider = provider;
        this.reference = reference;
        this.price = price;
    }
}

export = SendMailDigest;
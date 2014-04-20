import ProviderType = require('./ProviderType');
class SendMailDigest {
    provider : ProviderType.ProviderType;
    reference : string;
    constructor(provider : ProviderType.ProviderType, reference : string) {
        this.provider = provider;
        this.reference = reference;
    }
}

export = SendMailDigest;
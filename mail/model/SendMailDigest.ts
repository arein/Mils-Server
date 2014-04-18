/// <reference path='./Provider.ts' />
class SendMailDigest {
    provider : ProviderType;
    reference : string;
    constructor(provider : ProviderType, reference : string) {
        this.provider = provider;
        this.reference = reference;
    }
}
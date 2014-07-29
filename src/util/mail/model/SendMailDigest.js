var SendMailDigest = (function () {
    function SendMailDigest(provider, reference, priceInAud, priceInEur) {
        this.provider = provider;
        this.reference = reference;
        this.priceInAud = priceInAud;
        this.priceInEur = priceInEur;
    }
    return SendMailDigest;
})();

module.exports = SendMailDigest;
//# sourceMappingURL=SendMailDigest.js.map

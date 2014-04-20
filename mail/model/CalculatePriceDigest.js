var CalculatePriceDigest = (function () {
    function CalculatePriceDigest(priceInEur, city, country, courier) {
        this.priceInEur = priceInEur;
        this.city = city;
        this.country = country;
        this.courier = courier;
    }
    return CalculatePriceDigest;
})();

module.exports = CalculatePriceDigest;
//# sourceMappingURL=CalculatePriceDigest.js.map

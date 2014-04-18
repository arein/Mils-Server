class CalculatePriceDigest {
    priceInEur;
    city;
    country;
    courier;
    constructor(priceInEur : number, city : string, country : string, courier: string) {
        this.priceInEur = priceInEur;
        this.city = city;
        this.country = country;
        this.courier = courier;
    }
}
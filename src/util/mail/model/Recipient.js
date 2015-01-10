var Recipient = (function () {
    function Recipient(name, address1, city, zip, country, email, company, address2, state) {
        this.name = name;
        this.company = company;
        this.address1 = address1;
        this.address2 = address2;
        this.city = city;
        this.zip = zip;
        this.country = country;
        this.email = email;
        this.state = state;
    }
    return Recipient;
})();

module.exports = Recipient;
//# sourceMappingURL=LetterRecipient.js.map

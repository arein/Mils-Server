var CreditCard = (function () {
    function CreditCard(number, owner, expirationDate, cvv, type) {
        this.number = number;
        this.owner = owner;
        this.type = type;
        this.expirationDate = expirationDate;
        this.cvv = cvv;
    }
    return CreditCard;
})();

module.exports = CreditCard;
//# sourceMappingURL=CreditCard.js.map

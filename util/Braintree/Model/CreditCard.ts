class CreditCard {
    number : string;
    owner : string;
    type : string;
    cvv : string;
    expirationDate : string;

    constructor(number : string, owner : string, expirationDate : string, cvv : string, type? : string) {
        this.number = number;
        this.owner = owner;
        this.type = type;
        this.expirationDate = expirationDate;
        this.cvv = cvv;
    }
}

export = CreditCard;
class Recipient {
    name : string;
    company : string;
    address1 : string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    email: string;
    constructor(name : string, address1 : string, city : string, zip : string, country : string, email : string, company? : string, address2? : string, state? : string) {
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
}

export = Recipient;
import ClientType = require('ClientType')
class Client {
    type: ClientType.ClientType;
    uri: string;

    constructor(type: ClientType.ClientType, uri: string) {
        this.type = type;
        this.uri = uri;
    }
}

export = Client;
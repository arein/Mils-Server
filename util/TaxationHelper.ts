export function processTaxation(letter: any) {
    var isoCountry: string = letter.billingCountry;
    var net : string = (parseFloat(letter.price) / 1.19).toFixed(2);
    var vat : string = (parseFloat(letter.price) - parseFloat(net)).toFixed(2);
    if (isInEU(isoCountry)) {
        letter.net = net;
        letter.vat = vat;
    } else {
        letter.vatIncome = vat;
        letter.net = letter.price;
        letter.vat = 0;
    }
}

function isInEU(isoShortFormattedCountry : string) {
    switch (isoShortFormattedCountry) {
        case 'BE':
        case 'BG':
        case 'HR':
        case 'DK':
        case 'DE':
        case 'EE':
        case 'FI':
        case 'FR':
        case 'GR':
        case 'IE':
        case 'IT':
        case 'LT':
        case 'LV':
        case 'LU':
        case 'MT':
        case 'NL':
        case 'AT':
        case 'PL':
        case 'RO':
        case 'PT':
        case 'SE':
        case 'SK':
        case 'SI':
        case 'ES':
        case 'HU':
        case 'CZ':
        case 'GB':
        case 'CY':
            return true;
        default:
            return false;
    }
}
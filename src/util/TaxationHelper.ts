import Letter = require('../model/Letter')
export function processTaxation(letter: Letter) {
    var isoCountry: string = letter.issuer.country;
    var net : string = (letter.financialInformation.price / 1.19).toFixed(2);
    var vat : string = (letter.financialInformation.price - parseFloat(net)).toFixed(2);
    if (isInEU(isoCountry)) {
        letter.financialInformation.net = parseFloat(net);
        letter.financialInformation.vat = parseFloat(vat);
        letter.financialInformation.vatIncome = 0;
    } else {
        letter.financialInformation.vatIncome = parseFloat(vat);
        letter.financialInformation.net = letter.financialInformation.price;
        letter.financialInformation.vat = 0;
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
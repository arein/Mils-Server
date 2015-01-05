import Letter = require('../model/Letter')
export function processTaxation(letter: Letter) {
    var isoCountry: string = letter.issuer.country;
    letter.financialInformation.vatRate = getVatRate(isoCountry);
    if (isInEU(isoCountry)) {
        var net : string = (letter.financialInformation.price / (1 + letter.financialInformation.vatRate)).toFixed(2);
        var vat : string = (letter.financialInformation.price - parseFloat(net)).toFixed(2);
        letter.financialInformation.net = parseFloat(net);
        letter.financialInformation.vat = parseFloat(vat);
        letter.financialInformation.vatIncome = 0;
    } else {
        var net : string = (letter.financialInformation.price / 1.27).toFixed(2);
        var vat : string = (letter.financialInformation.price - parseFloat(net)).toFixed(2);
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

function getVatRate(isoShortFormattedCountry : string)  {
    switch (isoShortFormattedCountry) {
        case 'BE':
            return 0.21;
        case 'BG':
            return 0.20;
        case 'HR':
            return 0.25;
        case 'DK':
            return 0.25;
        case 'DE':
            return 0.19;
        case 'EE':
            return 0.20;
        case 'FI':
            return 0.24;
        case 'FR':
            return 0.20;
        case 'GR':
            return 0.23;
        case 'IE':
            return 0.23;
        case 'IT':
            return 0.22;
        case 'LT':
            return 0.21;
        case 'LV':
            return 0.21;
        case 'LU':
            return 0.15;
        case 'MT':
            return 0.18;
        case 'NL':
            return 0.21;
        case 'AT':
            return 0.20;
        case 'PL':
            return 0.23;
        case 'RO':
            return 0.24;
        case 'PT':
            return 0.23;
        case 'SE':
            return 0.25;
        case 'SK':
            return 0.20;
        case 'SI':
            return 0.22;
        case 'ES':
            return 0.21;
        case 'HU':
            return 0.27;
        case 'CZ':
            return 0.21;
        case 'GB':
            return 0.20;
        case 'CY':
            return 0.19;
        default:
            return 0;
    }
}
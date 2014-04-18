export class TaxationHelper {
    processTaxation(letter : string) {

    }

    isInEu(isoShortFormattedCountry : string) {
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
}
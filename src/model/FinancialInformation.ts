import Currency = require('./../util/Braintree/Model/Currency')
class FinancialInformation {
    vat: number;
    vatIncome: number;
    printingCostInAud: number;
    printingCostInEur: number;
    price: number;
    priceInSettlementCurrency: number;
    settlementCurrency: Currency;
    net: number;
    margin: number;
    creditCardCost: number;
}

export = FinancialInformation;
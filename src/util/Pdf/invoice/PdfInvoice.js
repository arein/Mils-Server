var Config = require('./../../../config');
var Currency = require('./../../../util/Braintree/Model/Currency');
var CurrencyConverter = require('./../../../util/CurrencyConverter');
var PdfInvoice = (function () {
    function PdfInvoice() {
    }
    PdfInvoice.createInvoice = function (letter, callback) {
        try  {
            var PDFDocument = require('pdfkit');
            var doc = new PDFDocument({ size: 'A4' });

            // Set some meta data
            doc.info['Title'] = 'Mils Invoice';
            doc.info['Author'] = 'Mils';

            // Register a font name for use later
            doc.registerFont('OpenSans-Regular', Config.getBasePath() + '/util/pdf/invoice/fonts/OpenSans-Regular.ttf');
            doc.registerFont('OpenSans-Light', Config.getBasePath() + '/util/pdf/invoice/fonts/OpenSans-Light.ttf');
            doc.registerFont('OpenSans-Bold', Config.getBasePath() + '/util/pdf/invoice/fonts/OpenSans-Bold.ttf');

            // Draw Images
            doc.image(Config.getBasePath() + '/util/pdf/invoice/assets/logo.png', 234, 21, { width: 125.88 }).image(Config.getBasePath() + '/util/pdf/invoice/assets/box.png', 48, 446, { width: 497.765 });

            //.fontSize(25)
            //.text('Some text with an embedded font!', 100, 100)
            //.fontSize(18)
            //.text('PNG and JPEG images:');
            // Sender
            doc.font('OpenSans-Light').fontSize(10).fillColor("#3470B8").text('Mils | Alexander-Derek Rein | Irmgardstr. 15 | 8179 Munich | Germany | VAT-ID DE298651109', 49.235, 184.6);

            // Recipient
            var paragraphGap = 0.002;
            doc.fontSize(21).fillColor("#000000").text(letter.issuer.name, 49.235, 212.539).moveDown(paragraphGap).text(letter.issuer.address1).moveDown(paragraphGap);
            if (typeof letter.issuer.address2 !== 'undefined') {
                doc.text(letter.issuer.address2).moveDown(paragraphGap);
            }
            doc.text(letter.issuer.postalCode + " " + letter.issuer.city).moveDown(paragraphGap).text(letter.issuer.country);

            // Bill #
            doc.fontSize(36).fillColor("#3470B8").text('Invoice # ' + letter.invoiceNumber, 49.235, 387.033);

            // Date
            var date = new Date();
            doc.font('OpenSans-Regular').fontSize(21).fillColor("#000000").text(date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear(), 346.095, 404.033, { width: 200, align: 'right' });

            var description = letter.pageCount + " pages to " + letter.recipient.countryIso;
            if (letter.pageCount == 1) {
                description = letter.pageCount + " page to " + letter.recipient.countryIso;
            }

            // Bill Content
            doc.font('OpenSans-Regular').fontSize(12).fillColor("#000000").text(description, 71, 511).text(letter.financialInformation.net + '€', 479, 511).text("VAT (" + letter.financialInformation.vatRate + ")", 71, 530).text(letter.financialInformation.vat + '€', 479, 530);

            if (letter.financialInformation.settlementCurrency === 0 /* EUR */) {
                // Final Amount
                doc.fontSize(18).fillColor("#3470B8").text('Final Amount', 49.235, 626.458).text(letter.financialInformation.price + '€', 432.095, 626.458, { width: 100, align: 'right' }).fillColor("#000000").fontSize(14).text("Your credit card was charged with the amount due.", 49.235, 650.464);
            } else {
                // Final Amount
                doc.fontSize(18).fillColor("#3470B8").text('Final Amount', 49.235, 626.458).text(letter.financialInformation.price + '€', 432.095, 626.458, { width: 100, align: 'right' }).text('Final Amount in ' + CurrencyConverter.convertCurrencyTypeToString(letter.financialInformation.settlementCurrency), 49.235, 656.458).text(letter.financialInformation.priceInSettlementCurrency, 432.095, 656.458, { width: 100, align: 'right' }).fillColor("#000000").fontSize(14).text("Your credit card was charged with the amount due.", 49.235, 680.464);
            }

            // Footer
            doc.font('OpenSans-Bold').fontSize(18).fillColor("#3470B8").text('Thank you for using Mils!', 49.235, 704.458);

            doc.font('OpenSans-Regular').fontSize(14).fillColor("#000000").text('Inquiries? Errors? Problems? Please get in touch via ', 49.235, 731.458).fillColor("#3470B8").text("billing@milsapp.com", 385.235, 731.458).link(385.235, 731.458, 85, 20, "mailto:billing@milsapp.com");

            doc.output(function (data) {
                callback(undefined, data);
            });
        } catch (err) {
            callback(err);
        }
    };
    return PdfInvoice;
})();

module.exports = PdfInvoice;
//# sourceMappingURL=PdfInvoice.js.map

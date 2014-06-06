import Letter = require('./../../../model/Letter');
import Config = require('./../../../config');
class PdfInvoice {
    createInvoice (letter: Letter, callback) {

        var PDFDocument = require('pdfkit');
        var doc = new PDFDocument({size: 'A4'});
        var app = require('./../app');

        // Set some meta data
        doc.info['Title'] = 'Mils Invoice';
        doc.info['Author'] = 'Alexander-Derek Rein';

        // Register a font name for use later
        doc.registerFont('OpenSans-Regular', Config.getBasePath() + '/pdf/fonts/OpenSans-Regular.ttf');
        doc.registerFont('OpenSans-Light', Config.getBasePath() + '/pdf/fonts/OpenSans-Light.ttf');
        doc.registerFont('OpenSans-Bold', Config.getBasePath() + '/pdf/fonts/OpenSans-Bold.ttf');

        // Draw Images
        doc.image(Config.getBasePath() + '/pdf/assets/logo.png', 234, 21, { width: 125.88})
            .image(Config.getBasePath() + '/pdf/assets/box.png', 48, 446, {width: 497.765});
        //.fontSize(25)
        //.text('Some text with an embedded font!', 100, 100)
        //.fontSize(18)
        //.text('PNG and JPEG images:');

        // Sender
        doc.font('OpenSans-Light')
            .fontSize(10)
            .fillColor("#3470B8")
            .text('Mils | Alexander-Derek Rein | Irmgardstr. 15 | 8179 Munich | Germany | VAT-ID DE298651109', 49.235, 184.6);

        // Recipient
        var paragraphGap = 0.002;
        doc.fontSize(21)
            .fillColor("#000000")
            .text(letter.issuer.name, 49.235, 212.539)
            .moveDown(paragraphGap)
            .text(letter.issuer.address1)
            .moveDown(paragraphGap);
        if (typeof letter.issuer.address2 !== 'undefined') {
            doc.text(letter.issuer.address2)
                .moveDown(paragraphGap);
        }
        doc.text(letter.issuer.postalCode + " " + letter.issuer.city)
            .moveDown(paragraphGap)
            .text(letter.issuer.country);

        // Bill #
        doc.fontSize(36)
            .fillColor("#3470B8")
            .text('Invoice # ' + letter.invoiceNumber, 49.235, 387.033);

        // Date
        var date = new Date();
        doc.font('OpenSans-Regular')
            .fontSize(21)
            .fillColor("#000000")
            .text(date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear(), 346.095, 404.033, {width: 200, align: 'right'})

        var description = letter.pageCount + " pages to " + letter.recipient.countryIso;
        if (letter.pageCount == 1) {
            description = letter.pageCount + " page to " + letter.recipient.countryIso;
        }

        // Bill Content
        doc.font('OpenSans-Regular')
            .fontSize(12)
            .fillColor("#000000")
            .text(description, 71, 511)
            .text(letter.net + '€', 479, 511)
            .text("VAT",  71, 530)
            .text(letter.vat + '€', 479, 530);

        // Final Amount
        doc.fontSize(18)
            .fillColor("#3470B8")
            .text('Final Amount', 49.235, 626.458)
            .text(letter.price + '€', 432.095, 626.458, {width: 100, align: 'right'})
            .fillColor("#000000")
            .fontSize(14)
            .text("Your credit card was charged with the amount due.", 49.235, 650.464);

        // Footer
        doc.font('OpenSans-Bold')
            .fontSize(18)
            .fillColor("#3470B8")
            .text('Thank you for using Mils!', 49.235, 694.458);

        doc.font('OpenSans-Regular')
            .fontSize(14)
            .fillColor("#000000")
            .text('Inquiries? Errors? Problems? Please get in touch via ', 49.235, 721.458)
            .fillColor("#3470B8")
            .text("billing@milsapp.com", 385.235, 721.458)
            .link(385.235, 721.458, 85, 20, "mailto:billing@milsapp.com");

        doc.output(function(string) {
            callback(string);
        });
    }
}

// export the class
export = PdfInvoice;
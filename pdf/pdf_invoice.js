/**
 * New node file
 */

// Constructor
function PdfInvoice() {
}
// class methods
PdfInvoice.prototype.createInvoice = function(user, date, invoiceNumber, description, amount, vat, finalPrice, callback) {

	var PDFDocument = require('pdfkit');
	var doc = new PDFDocument({size: 'A4'});

	// Set some meta data
	doc.info['Title'] = 'Mils Invoice';
	doc.info['Author'] = 'Alexander-Derek Rein';

    // Register a font name for use later
	doc.registerFont('OpenSans-Regular', app.basePath + '/pdf/fonts/OpenSans-Regular.ttf');
	doc.registerFont('OpenSans-Light', app.basePath + '/pdf/fonts/OpenSans-Light.ttf');
	doc.registerFont('OpenSans-Bold', app.basePath + '/pdf/fonts/OpenSans-Bold.ttf');

	// Draw Images
	doc.image(app.basePath + '/pdf/assets/logo.png', 234, 21, { width: 125.88})
	   .image(app.basePath + '/pdf/assets/box.png', 48, 446, {width: 497.765});
	   //.fontSize(25)
	   //.text('Some text with an embedded font!', 100, 100)
	   //.fontSize(18)
	   //.text('PNG and JPEG images:');
	
	// Sender
	doc.font('OpenSans-Light')
	   .fontSize(9)
	   .fillColor("#3470B8")
	   .text('Mils | Alexander-Derek Rein | Irmgardstr. 15 | 8179 Munich | Germany | VAT-ID DE298651109', 49.235, 184.6);
	
	// Recipient
	var paragraphGap = 0.002;
	doc.fontSize(21)
	   .fillColor("#000000")
	   .text(user.address.name, 49.235, 212.539)
	   .moveDown(paragraphGap)
	   .text(user.address.line1)
	   .moveDown(paragraphGap);
	if (user.address.line2) {
		doc.text(user.address.line2)
		   .moveDown(paragraphGap);
	}
	doc.text(user.address.postalCode + " " + user.address.city)
	   .moveDown(paragraphGap)
	   .text(user.address.country);
	
	// Bill #
	doc.fontSize(36)
	   .fillColor("#3470B8")
	   .text('Invoice # ' + invoiceNumber, 49.235, 387.033);
	
	// Date
	doc.font('OpenSans-Regular')
	   .fontSize(21)
	   .fillColor("#000000")
	   .text(date.getDate() + "." + date.getMonth() + 1 + "." + date.getFullYear(), 346.095, 404.033, {width: 200, align: 'right'})
	
	// Bill Content
	doc.font('OpenSans-Regular')
	   .fontSize(12)
	   .fillColor("#000000")
	   .text(description, 71, 511)
	   .text(amount + '€', 479, 511)
	   .text("VAT", 71, 530)
	   .text(vat + '€', 479, 530);
	
	// Final Amount
	doc.fontSize(18)
	   .fillColor("#3470B8")
	   .text('Final Amount', 49.235, 626.458)
	   .text(finalPrice + '€', 432.095, 626.458, {width: 100, align: 'right'})
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
};

// export the class
exports.PdfInvoice = PdfInvoice;


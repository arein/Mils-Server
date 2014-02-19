var pdf = require("./pdf_invoice");
var PdfInvoice = new pdf.PdfInvoice();
var fs = require("fs");

var user = {
		address: {
			name: "Markus Döring",
			line1: "Irmgardstr. 15",
			line2: "Zimmer 2",
			postalCode: "81479",
			city: "Munich",
			country: "Germany"
		}
};
PdfInvoice.createInvoice(user, new Date(), "858493949", "5 pages to China", 3.99, 0, 3.99, function(data) {
	fs.writeFile("out.pdf", data, function(err) {
		if (err) throw err;
		console.log("File Written");
	});
});
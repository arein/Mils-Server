/**
 * New node file
 */

// Constructor
function Docsaway() {
}

// class methods
Docsaway.prototype.sendMail = function(filepath, recipient, callback) {
	var installationKey = 'HzPSxZHdY49xIeylq7S5iC7ceqB3i7sxEfmGz82zbN9euyuArzMWJ5CRqo0kapOY';
	var email = 'test-docsaway-api@ceseros.de';
	// /Users/arein/node/letterapp 
	var docsaway = require('../../docsaway-nodejs/lib/main');
	
	var data = {
		recipient: recipient
	};
	
	var fs = require('fs');
	fs.readFile(filepath, function (err, pdf) {
	  if (err) throw err;
		data.file = pdf.toString('base64');
		var client = new docsaway.Client(email, installationKey, "TEST");
		client.sendMail(data.recipient, data.file, function (error, result) {
			callback(error, "docsaway", result.transaction.reference);
		});
	});
};

Docsaway.prototype.calculatePrice = function(pages, destinationCountryIso, callback) {
	var installationKey = 'HzPSxZHdY49xIeylq7S5iC7ceqB3i7sxEfmGz82zbN9euyuArzMWJ5CRqo0kapOY';
	var email = 'test-docsaway-api@ceseros.de';
	// /Users/arein/node/letterapp 
	var docsaway = require('../../docsaway-nodejs/lib/main');
	
	// Request Price
	var client = new docsaway.Client(email, installationKey, "TEST");
	client.calculatePrice(destinationCountryIso, pages, function (error, result) {
		if (error) {
			callback(error);
			return;
		}
		var priceInEur = result.price * 0.65 * 0.75; // Conversion and reduced price
		callback(undefined, priceInEur, result.city, result.country, result.courier);
	});
};

// export the class
exports.Docsaway = Docsaway;
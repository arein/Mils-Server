var installationKey = 'HzPSxZHdY49xIeylq7S5iC7ceqB3i7sxEfmGz82zbN9euyuArzMWJ5CRqo0kapOY';
var email = 'test-docsaway-api@ceseros.de';
var docsaway = require('../lib/main');

var data = {
	credentials: {
		email: email,
		installationKey: installationKey,
		mode: 'TEST'
	},
	recipient: {
		name: 'Alexander-Derek Rein',
		company: false,
		address1: 'Irmgardstr. 15',
		address2: false,
		city: 'München',
		state: false,
		zip: 81479,
		country: 'DE'
	}
};

var fs = require('fs');
fs.readFile('Sample.pdf', function (err, pdf) {
	if (err) throw err;
	data.file = pdf.toString('base64');
	
	var client = new docsaway.Client(email, installationKey, "TEST");
	client.sendMail(data.recipient, data.file, function (result) {
		console.log(result);
	});
});
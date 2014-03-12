/**
 * New node file
 */

// Constructor
function MailClient() {
	var ctx = require('./context');
	var policy = require('./policy');
	this.context = new ctx.Context();
	this.policy = new policy.Policy(this.context);
}

// class methods
MailClient.prototype.sendMail = function(filepath, recipient, callback) {
	this.policy.configure(recipient.country);
	this.context.sendMail(filepath, recipient, callback);
};

MailClient.prototype.calculatePrice = function(pages, destinationCountry, preferredCurrency, callback) {
	this.policy.configure(destinationCountry);
	
	this.context.calculatePrice(pages, destinationCountry, function (error, price, printingCity, printingCountry, courier) {
		// add service charge
		if (error) {
			callback(error);
			return;
		}
		if (preferredCurrency.toLowerCase() == 'eur') {
			callback(error, price, price, printingCity, printingCountry, courier);
		} else {
			// TODO: Convert Currency
		}
	});
};

// export the class
exports.MailClient = MailClient;
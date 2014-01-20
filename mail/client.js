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
MailClient.prototype.sendMail = function(filepath, pages, destinationCountry, callback) {
	this.policy.configure(pages, destinationCountry);
	this.context.sendMail(filepath, callback);
};

MailClient.prototype.calculatePrice = function(pages, destinationCountry, preferredCurrency) {
	this.policy.configure(pages, destinationCountry);
	
	var priceInEur = this.context.calculatePrice(pages, destinationCountry);
	if (preferredCurrency.toLowerCase() == 'eur') {
		return {
			priceInEur: priceInEur,
			priceInPreferredCurrency: priceInEur
		};
	} else {
		// TODO: Convert Currency
	}
};

// export the class
exports.MailClient = MailClient;
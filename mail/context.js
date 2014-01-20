/**
 * New node file
 */

// Constructor
function Context() {
	this.mailStrategy = undefined;
}

// class methods
Context.prototype.setMailStrategy = function(mailStrategy) {
	this.mailStrategy = mailStrategy;
};

Context.prototype.sendMail = function(filepath, callback) {
    var sk = require('./strategies/sms_kaufen');
	var sms = new sk.SmsKaufen();
	sms.sendMail(filepath, callback);
};

Context.prototype.calculatePrice = function(pages, destination) {
    var sk = require('./strategies/sms_kaufen');
	var sms = new sk.SmsKaufen();
	return sms.calculatePrice(pages, destination);
};

// export the class
exports.Context = Context;
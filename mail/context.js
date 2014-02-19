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

Context.prototype.sendMail = function(filepath, recipient, callback) {
	this.mailStrategy.sendMail(filepath, recipient, callback);
};

Context.prototype.calculatePrice = function(pages, destination, callback) {
	this.mailStrategy.calculatePrice(pages, destination, callback);
};

// export the class
exports.Context = Context;
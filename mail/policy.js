/**
 * New node file
 */

// Constructor
function Policy(theContext) {
	this.context = theContext;
}

// class methods
Policy.prototype.configure = function(destinationCountry) {
	//if (destinationCountry.toLowerCase() == 'de')
	if (false) // currently not possible
	{
		var sk = require('./strategies/sms_kaufen');
		this.context.setMailStrategy(new sk.SmsKaufen());
	}
	else
	{
		var da = require('./strategies/docsaway');
		this.context.setMailStrategy(new da.Docsaway());
	}
};

// export the class
exports.Policy = Policy;
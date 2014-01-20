/**
 * New node file
 */

// Constructor
function BraintreeHelper() {
	this.braintree = require("braintree");
	this.gateway = this.braintree.connect({
		  environment: this.braintree.Environment.Sandbox,
		  merchantId: "7sj5c56hggvmgrfw",
		  publicKey: "78rfb5jwd4877d48",
		  privateKey: "333775c67b6af31779a8bc9e8c529b31"
		});
}
// class methods
BraintreeHelper.prototype.pay = function(paymentObject, success, failure) {	
	var saleRequest = {
	    amount: paymentObject.amount,
	    creditCard: {
	      number: paymentObject.user.creditCard.number,
	      cvv: paymentObject.user.creditCard.cvv,
	      expirationDate: paymentObject.user.creditCard.date
	    },
	    options: {
	      submitForSettlement: true
	    }
	  };
	
	// development only
	if ('development' == app.get('env')) {
		success("development");
	    return;
	}

	  this.gateway.transaction.sale(saleRequest, function (err, result) {
	    if (result != undefined && result.success) {
	    	success(result);
	    } else {
	    	failure(err);
	    }
	  });
};

// export the class
exports.BraintreeHelper = BraintreeHelper;
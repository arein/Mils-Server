/**
 * New node file
 */

// Constructor
function SmsKaufen() {
}

// class methods
SmsKaufen.prototype.sendMail = function(filepath, recipient, callback) {
	console.log("Sending Mail");
	
	var FormData = require('form-data');
	var fs = require('fs');

	var form = new FormData();
	form.append('art', 'b');
	form.append('id', 'arein');
	form.append('apikey', '5b384ce32d8cdef02bc3a139d4cac0a22bb029e8');
	form.append('mode', '1'); // 1 == test, 0 == live
	form.append('pw', 'Derek12345');
	form.append('document', fs.createReadStream(filepath));
	
	form.submit('http://www.smskaufen.com/sms/post/postin.php', function(err, res) {
		  // res – response object (http.IncomingMessage)  //
		  if (res != undefined && err == undefined) {
			  res.resume(); // for node-0.10.x
			  res.on('data', function(chunk) {
				  callback(undefined, "smskaufen", chunk);
			    });
		  } else {
			  callback(err, "smskaufen", res);
		  }
		});
};

SmsKaufen.prototype.calculatePrice = function(pages, destination, callback) {
	var price = 0.28;
	
	pages = pages + 1; // we have to print a coverpage
	
	// Print
	if (pages > 2) {
		var tempPages = pages - 2;
		if (tempPages > 0) {
			price += tempPages * 0.09;
		}
	}
	
	if (destination.toLowerCase() == "germany") {
		if (pages <= 4) {
			price += 0.58;
		} else if (pages <= 16) {
			price += 0.90;
		} else if (pages <= 99) {
			price += 1.45;
		}
	} else {
		if (pages <= 4) {
			price += 0.75;
		} else if (pages <= 16) {
			price += 1.50;
		} else if (pages <= 99) {
			price += 3.45;
		}
	}
	
	callback('', price, "Herford", "Germany");
};

// export the class
exports.SmsKaufen = SmsKaufen;
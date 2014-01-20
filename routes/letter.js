var express = require("express");
var mongo = require('mongodb');
/*
 * GET users listing.
 */


var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('letterdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to winedb database");
        db.createCollection('letter', {strict:true}, function(err, collection) {
            if (!err) {
                console.log("The letter collection doesn't exist. Creating it with sample data");
            }
        });

    	db.createCollection('counters', {strict:true}, function(err, collection) {
            if (!err) {
                console.log("Counters Collection created. Creating it with sample data");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving wine: ' + id);
    db.collection('letter', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('letter', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.purchaseLetter = function(req, res) {
	var check = require('validator').check,
        sanitize = require('validator').sanitize;
	
	// Validation
	var id = req.params.id;
	check(id).notNull();
	check(req.body.amount).isDecimal();
	check(req.body.user).notNull();
	check(req.body.user.emailAddress).notNull().isEmail();
	check(req.body.user.address).notNull();
	check(req.body.user.creditCard).notNull();
	check(req.body.user.creditCard.number).notNull();
	check(req.body.user.creditCard.cvv).notNull();
	check(req.body.user.creditCard.date).notNull();
	check(req.body.user.address.name).notNull();
	check(req.body.user.address.line1).notNull();
	check(req.body.user.address.postalCode).notNull();
	check(req.body.user.address.city).notNull();
	check(req.body.user.address.country).notNull();
	
	var status = {
		pdfProcessed: false,
		billProcessed: false
	};
	
	db.collection('letter', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
          if (err) throw err;
		  var braintreeHelper = new (require('./../util/braintree_helper')).BraintreeHelper();
		  braintreeHelper.pay(req.body, function (result) {
			item.payed = true;
	    	console.log("Money Transferred");
	    	getNextSequence("invoicenumber", function (invoiceNumber) {
	    		item.invoiceNumber = invoiceNumber;
	    	    var mc = require('./../mail/client');
	    	    var mailClient = new mc.MailClient();
	    	    var prefix = app.basePath + '/public/pdf/';
	    	    mailClient.sendMail(prefix + item.pdf, true, "DE", function(err, provider, letterId) {
	    	    	status.pdfProcessed = true;
	    	    	
	    	    	if (err) {
	    	    		item.pdfDelivered = false;
	    	    		item.provider = provider;
	    	    	} else {
	    	    		item.pdfDelivered = true;
	    	    		item.pdfId = letterId;
	    	    		item.provider = provider;
	    	    	}
	    	    	
	    	    	conclude(status, item, res);
	    	    });
		    
			    // Send Email
	    	    sendBill(req.body.user, req.body.amount, item.invoiceNumber, item.country, item.pageCount, 'invoice-' + item.pdf, function (err) {
	    	    	status.billProcessed = true;
	    	    	if (err) {
	  	              item.billSent = false;
	  	              console.log("Err" + err); // handle error
	  	            } else {
	  		        	item.billSent = true;
	  		        	console.log("Invoice sent");
	  	            }
	    	    	
	    	    	conclude(status, item, res);
	    	    });
	    	});
		  }, function (error) {
			  res.json(500, error);
		  });
        });
    });
};

function conclude(status, letter, res) {
	if (!status.pdfProcessed || !status.billProcessed) {
		return;
	}
    letter.upadtedAt = new Date();
	
	db.collection('letter', function(err, collection) {
        collection.update({'_id':letter._id}, letter, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating letter: ' + err);
                res.send(500, {'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(letter);
            }
        });
    });
}

function sendBill(recipient, amount, invoiceNumber, destination, pageCount, fileName, callback) {
	var fs = require("fs");
	var pdf = require(app.basePath + "/pdf/pdf_invoice");
	var pdfInvoice = new pdf.PdfInvoice();
	var prefix = app.basePath + '/public/pdf/';
	var path = prefix + fileName;
	var description = pageCount + " pages to " + destination;
	if (pageCount == 1) {
		description = pageCount + " page to " + destination;
	}
	
	pdfInvoice.createInvoice(recipient, new Date(), invoiceNumber, description, amount, false, function (data) {
		fs.writeFile(path, data, function(err) {
			if (err) throw err;
			console.log("File Written");
			app.mailer.send('email', {
		        to: '"Ceseros" <test@dev.ceseros.de>', // REQUIRED. This can be a comma delimited string just like a normal email to field. 
		        subject: 'Purchase', // REQUIRED.
		        invoiceNumber: invoiceNumber, // All additional properties are also passed to the template as local variables.
		      },
		      {
		    	  attachments : [{fileName: 'Invoice.pdf', filePath: path}]
		      }, callback);
		});
	});
	
}

exports.uploadLetter = function(req, res) {
    var letter = req.body;
    letter.createdAt = new Date();
    letter.upadtedAt = new Date();
    letter.pdfDelivered = false;
    letter.billSent = false;
    letter.payed = false;
    letter.pdfId = null;
    letter.provider = null;
    
    // Validation
    var tmp = require('tmp');
    var prefix = app.basePath + '/public/pdf/';
    tmp.tmpName({ template: prefix + 'letter-XXXXXX.pdf' }, function _tempNameGenerated(err, path) {
        if (err) throw err;

        // Write PDF to File
        var fs = require('fs');
        var buf = new Buffer(letter.pdf, 'base64');
        fs.writeFile(path, buf, function (err) {
    	  if (err) {
    		  console.log(err);
    		  throw err;
    	  }
    	  console.log('It\'s saved!');
    	  
    	  letter.pdf = path.replace(prefix, '');
    	  
    	  var PFParser = require("pdf2json");
	      var pdfParser = new PFParser();
	      pdfParser.on("pdfParser_dataReady", function(data) {
	    	  letter.pageCount = data.PDFJS.pages.length;
	    	  db.collection('letter', function(err, collection) {
	    	    collection.insert(letter, {safe:true}, function(err, result) {
	    	      if (err) {
	    	        console.log('Error: ' + err);
	    	        res.send(500, "An error occurred on the server side");
	    	      } else {
	    	        console.log('Pdf Saved (' + data.PDFJS.pages.length + 'pages) ' + JSON.stringify(result[0]));
	    	        res.send(result[0]);
	    	      }
	    	    });
	    	  });
	      });
	      pdfParser.on("pdfParser_dataError", function (error) {
	    	  throw error;
	      });
	      pdfParser.loadPDF(path);
    	});
    });
};

exports.calculatePrice = function(req, res) {
    var pages = req.query.pages,
        destination = req.query.destination,
        preferredCurrency = req.query.preferred_currency;
    
    // Validation
	var check = require('validator').check,
    sanitize = require('validator').sanitize;
    check(pages).notNull().isInt();
    check(destination).notNull();
    check(preferredCurrency).notNull().len(1,6);
    
	var mailClient = new (require('./../mail/client')).MailClient();
    console.log("Pages: %s, Destination: %s, Preferred Currency: %s", pages, destination, preferredCurrency);
    var price = mailClient.calculatePrice(pages, destination, preferredCurrency);
    console.log('Price is ' + price.priceInEur + "EUR");
    res.send({'preferredCurrency': preferredCurrency, 'priceInEur': price.priceInEur, 'priceInPreferredCurrency': price.priceInPreferredCurrency});
};

exports.updateLetter = function(req, res) {
    var id = req.params.id;
    var wine = req.body;
    console.log('Updating wine: ' + id);
    console.log(JSON.stringify(wine));
    db.collection('letter', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating wine: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(wine);
            }
        });
    });
};

exports.deleteLetter = function(req, res) {
    var id = req.params.id;
    console.log('Deleting wine: ' + id);
    db.collection('letter', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var letters = [
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        senderName: 'Philipp Malige',
        senderStreet: 'Gabelsbergerstraße'
    }];
    
    var counters = [{
	      _id: "invoicenumber",
	      seq: 15000
	   }];

    db.collection('letter', function(err, collection) {
        collection.insert(letters, {safe:true}, function(err, result) {});
    });

    db.collection('counters', function(err, collection) {
        collection.insert(counters, {safe:true}, function(err, result) {});
    });

};

function getNextSequence(name, callback) {
   db.collection('counters', function(err, collection) {
	   collection.findAndModify({ _id: name }, [['_id','asc']], { $inc: { seq: 1 } }, {new: true}, function(error, item) {
		   if (err) throw err;
		   callback(item.seq);
	   });
   });
}
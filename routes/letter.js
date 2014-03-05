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
	check(req.body).notNull();
	check(req.body.emailAddress).notNull().isEmail();
	check(req.body.address).notNull();
	check(req.body.creditCard).notNull();
	check(req.body.creditCard.number).notNull();
    req.body.creditCard.type = undefined; // we do not need this input
	check(req.body.creditCard.cvv).notNull();
	check(req.body.creditCard.date).notNull();
	check(req.body.address.name).notNull();
	check(req.body.address.line1).notNull();
	check(req.body.address.postalCode).notNull();
	check(req.body.address.city).notNull();
	check(req.body.address.country).notNull();
	
	var status = {
		pdfProcessed: false,
		billProcessed: false
	};
	
	db.collection('letter', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
          if (err) throw err;
		  var braintreeHelper = new (require('./../util/braintree_helper')).BraintreeHelper();
		  braintreeHelper.pay(item.price, req.body.creditCard, function (result) {
			item.payed = true;
	    	getNextSequence("invoicenumber", function (invoiceNumber) {
	    		item.invoiceNumber = invoiceNumber;
                item.email = req.body.emailAddress;
				
				// Generate Recipient Object
				var recipient = {
					name: item.recipientName,
					company: item.recipientCompany,
					address1: item.recipientAddress1,
					address2: item.recipientAddress2,
					city: item.recipientCity,
					state: item.recipientState,
					zip: item.recipientPostalCode,
					country: item.recipientCountryIso,
                    email: item.email
				};
				
				processTaxation(item);

	    	    var mc = require('./../mail/client');
	    	    var mailClient = new mc.MailClient();
	    	    var prefix = app.basePath + '/public/pdf/';
	    	    mailClient.sendMail(prefix + item.pdf, recipient, function(err, provider, letterId) {
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
	    	    sendBill(req.body, item, 'invoice-' + item.pdf, function (err) {
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

function processTaxation(letter) {
	var isoCountry = letter.recipientCountryIso;
	if (isInEU(isoCountry)) {
		letter.net = parseFloat(letter.price / 1.19).toFixed(2);
		letter.vat = parseFloat(letter.price - letter.net).toFixed(2);
	} else {
		letter.net = letter.price;
		letter.vat = 0;
	}
}

function isInEU(isoCountry) {
	switch (isoCountry) {
		case 'BE':
		case 'BG':
		case 'HR':
		case 'DK':
		case 'DE':
		case 'EE':
		case 'FI':
		case 'FR':
		case 'GR':
		case 'IE':
		case 'IT':
		case 'LT':
		case 'LV':
		case 'LU':
		case 'MT':
		case 'NL':
		case 'AT':
		case 'PL':
		case 'RO':
		case 'PT':
		case 'SE':
		case 'SK':
		case 'SI':
		case 'ES':
		case 'HU':
		case 'CZ':
		case 'GB':
		case 'CY':
			return true;
		default:
			return false;
	}
}

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

function sendBill(recipient, letter, fileName, callback) {
	// .price, item.invoiceNumber, item.country, item.pageCount
	var fs = require("fs");
	var pdf = require(app.basePath + "/pdf/pdf_invoice");
	var pdfInvoice = new pdf.PdfInvoice();
	var prefix = app.basePath + '/public/pdf/';
	var path = prefix + fileName;
	var description = letter.pageCount + " pages to " + letter.country;
	if (letter.pageCount == 1) {
		description = letter.pageCount + " page to " + letter.country;
	}
	
	pdfInvoice.createInvoice(recipient, new Date(), letter.invoiceNumber, description, letter.net, letter.vat, letter.price, function (data) {
		fs.writeFile(path, data, function(err) {
			if (err) throw err;
			console.log("File Written");
            var email = '"' + recipient.name + '" <' + letter.email +'>';
            var serverPath = "http://prod.ceseros.de:3000";

            if ('development' == app.get('env')) {
                email = '"Ceseros" <test@dev.ceseros.de>';
                serverPath = "http://localhost:3000";
            }

			app.mailer.send('email', {
		        to: email, // REQUIRED. This can be a comma delimited string just like a normal email to field.
		        subject: 'Purchase', // REQUIRED.
		        invoiceNumber: letter.invoiceNumber, // All additional properties are also passed to the template as local variables.
                serverPath: serverPath
		      },
		      {
		    	  attachments : [{fileName: 'Invoice.pdf', filePath: path}]
		      }, callback);
		});
	});
	
}

exports.uploadLetter = function(req, res) {
    // Validation
	var check = require('validator').check;
	check(req.body.pdf).notNull();
	check(req.body.recipientName).notNull();
	check(req.body.recipientAddress1).notNull();
	check(req.body.recipientCity).notNull();
	check(req.body.recipientPostalCode).notNull();
	check(req.body.recipientCountryIso).notNull();
	
	var shouldDownload = req.query.download == 'true'; // Determine whether the pdf should be downloaded
	
	var letter = req.body;
	letter.createdAt = new Date();
	letter.upadtedAt = new Date();
	letter.pdfDelivered = false;
	letter.billSent = false;
	letter.payed = false;
	letter.pdfId = null;
	letter.provider = null;
	
	// Recipient Data
	letter.recipientName = req.body.recipientName;
	letter.recipientCompany = (req.body.recipientCompany == undefined) ? false : req.body.recipientCompany;
	letter.recipientAddress1 = req.body.recipientAddress1;
	letter.recipientAddress2 = (req.body.recipientAddress2 == undefined) ? false : req.body.recipientAddress2;
	letter.recipientCity = req.body.recipientCity;
	letter.recipientPostalCode = req.body.recipientPostalCode;
	letter.recipientState = (req.body.recipientState == undefined) ? false : req.body.recipientState;
	letter.recipientCountryIso = req.body.recipientCountryIso;
	
	var tmp = require('tmp');
	var prefix = app.basePath + '/public/pdf/';
	tmp.tmpName({ template: prefix + 'letter-XXXXXX.pdf' }, function _tempNameGenerated(err, path) {
		if (err) throw err;
		
		// Write PDF to File
		if (letter.pages != undefined) {
			var PDFDocument = require('pdfkit');
			var doc = new PDFDocument({size: 'A4'});
			doc.image(new Buffer(letter.pages[0].image, 'base64'), 0, 0, {fit: [595.28, 841.89]});
			var signature = new Buffer(letter.signature, 'base64');
			addSignatures(signature, doc, letter.pages[0].signatures);
			console.log("Added Image to Doc");
			for (var i = 1; i < letter.pages.length; i++) {
				doc.addPage();
				doc.image(new Buffer(letter.pages[i].image, 'base64'), 0, 0, {fit: [595.28, 841.89]});
				addSignatures(signature, doc, letter.pages[i].signatures);
			}
			doc.output(function(data) {
				var fs = require('fs');
				fs.writeFile(path, data, function(err) {
					if (err) throw err;
					letter.pdf = path.replace(prefix, ''); // "Repair Path"
					letter.pageCount = letter.pages.length;
					letter.pages = undefined;
					letter.signature = undefined;
					insertLetter(letter, res, shouldDownload);
				});
			});
		} else {
			var fs = require('fs');
			var buf = new Buffer(letter.pdf, 'base64');
			fs.writeFile(path, buf, function (err) {
				if (err) throw err;
				console.log('It\'s saved!');
				  
				letter.pdf = path.replace(prefix, ''); // "Repair Path"
				var PFParser = require("pdf2json");
				var pdfParser = new PFParser();
				pdfParser.on("pdfParser_dataReady", function(data) {
					letter.pageCount = data.PDFJS.pages.length;
					insertLetter(letter, res, shouldDownload);
				});
				pdfParser.on("pdfParser_dataError", function (error) {
					throw error;
				});
				pdfParser.loadPDF(path);
			});
		}
	});
};

function addSignatures(buffer, doc, signatures) {
	var scaleFactor = 1.0101968821;
	for (var i = 0; i < signatures.length; i++) {
		doc.image(buffer, signatures[i].x, signatures[i].y * scaleFactor, {width: signatures[i].width, height: signatures[i].height * scaleFactor});
		console.log("Added Image to Doc");
	}
}

function insertLetter(letter, res, shouldDownload) {
	var fs = require('fs');
    var check = require('validator').check;
    var prefix = app.basePath + '/public/pdf/';

	var stats = fs.statSync(prefix + letter.pdf);
	var fileSizeInBytes = stats["size"];
	//Convert the file size to megabytes (optional)
	var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

    if (fileSizeInMegabytes > 2) {
        res.send(400, {'error': 'The File may not be larger than 2mb.'});
        return;
    }

	var mailClient = new (require('./../mail/client')).MailClient();
    mailClient.calculatePrice(letter.pageCount, letter.recipientCountryIso, "EUR", function (error, priceInEur, price, city, country, courier) {
		if (error) {
			res.send(502, {'error': error.message});
			return;
		}
        letter.courier = courier;
        letter.printingCity = city;
        letter.printingCountry = country;
    	letter.price = priceInEur;
		db.collection('letter', function(err, collection) {
		    collection.insert(letter, {safe:true}, function(err, result) {
		      if (err) {
		        res.send(500, "An error occurred on the server side");
		      } else {
		        if (shouldDownload) {
	              	fs.readFile(prefix + letter.pdf, function (err,data) {
	        	      if (err) res.send(500, "An error occurred on the server side:" + err);
					  result[0].pdf = data.toString("base64");
					  res.send(result[0]);
					});
	            } else {
	                res.send(result[0]);
	            }
		      }
		    });
		});
	});
}

exports.calculatePrice = function(req, res) {
	var check = require('validator').check; // Validation
    var pages = req.query.pages,
        destination = req.query.destination,
        preferredCurrency = req.query.preferred_currency;


    console.log(req.query);
   
    check(pages).notNull().isInt();
    check(destination).notNull();
    check(preferredCurrency).notNull().len(1,6);
    
	var mailClient = new (require('./../mail/client')).MailClient();
    mailClient.calculatePrice(pages, destination, preferredCurrency, function (error, price, price, city, country, courier) {
    	if (error) {
    		res.send(502, {'error': error.message});
    	} else {
    		res.send({'preferredCurrency': preferredCurrency, 'priceInEur': price, 'priceInPreferredCurrency': price, 'printingCity': city, 'printingCountry': country, 'courier': courier});
    	}
	});
};

exports.updateLetter = function(req, res) {
    var id = req.params.id;
    var wine = req.body;
    console.log('Updating wine: ' + id);
    console.log(JSON.stringify(wine));
    db.collection('letter', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
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

exports.index = function(req, res) {
	var countries = getCountries(function (data) {
		res.render('index', {countries: data});
	});
};

function getCountries(callback) {
	var csv = require('csv');
	csv()
	.from.path(__dirname+'/../private/ISO3166.txt', { delimiter: ';'})
	.to.array(function(data){
	   callback(data);
	})
	.transform( function(row){
	  row.unshift(row.pop());
	  return row;
	});
}

var path = require('path');
var mime = require('mime');

exports.osxDownload = function(req, res) {
    var file = app.basePath + '/public/downloads/Mils.app.zip';
    res.download(file)
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
/**
 * Created by arein on 09/03/14.
 */
var express = require('express'),
    http = require('http'),
    path = require('path'),
    mailer = require('express-mailer');

app = express(); // Global

// development only
if ('development' == app.get('env')) {
    app.basePath = "/Users/arein/node/letterapp/src";
} else {
    app.basePath = "/var/www/letterapp/src";
    console.log("Running production");
}

// all environments
app.use(express.limit('70mb'));
app.use(express.json({limit: '70mb'}));
app.use(express.urlencoded({limit: '70mb'}));
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, './../views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, './../public')));
app.use(express.bodyParser());

if ('development' == app.get('env')) {
    mailer.extend(app, {
        from: 'test@dev.ceseros.de',
        host: 'dev.ceseros.de', // hostname
        secureConnection: false, // use SSL
        port: 25, // port for secure SMTP
        transportMethod: 'SMTP' // default is SMTP. Accepts anything that nodemailer accepts
    });
} else {
    mailer.extend(app, {
        from: 'hello@milsapp.com',
        host: 'intern.ceseros.de', // hostname
        secureConnection: false, // use SSL
        port: 25, // port for secure SMTP
        transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
        auth: {
            user: 'hello@milsapp.com',
            pass: 'Mk72TBbL'
        }
    });
}

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.configure(function () {
    app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
});

var mongo = require('mongodb');
var config = require('./../config')


var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('letterdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to Mils database");
        db.createCollection('letter', {strict:true}, function(err, collection) {
            if (!err) {
                console.log("The Mils collection doesn't exist. Creating it with sample data");
            }
        });

        db.createCollection('counters', {strict:true}, function(err, collection) {
            if (!err) {
                console.log("Counters Collection created. Creating it with sample data");
            }
        });

        sendBills(); // Get started
    }
});

function sendBills() {
    db.collection('letter', function(err, collection) {
        collection.find({'billSent': {'$ne': true }, 'sandboxPurchase': false}, function(err, collection) {
            collection.toArray(function (err, letters) {
                console.log("" + letters.length + " bills to be sent");
                if (err) throw err;
                letters.forEach(function(letter) {

                    // Generate Recipient Object
                    var recipient = {
                        address: {
                            name: letter.billingName,
                            address1: letter.billingAddress1,
                            address2: letter.billingAddress2,
                            city: letter.billingCity,
                            zip: letter.billingPostalCode,
                            country: letter.billingCountry
                        },
                        email: letter.billingEmail
                    };

                    // Send Email
                    sendBill(recipient, letter, 'invoice-' + letter.pdf, function (err) {
                        if (err) {
                            letter.billSent = false;
                            console.log("Err" + err); // handle error
                        } else {
                            letter.billSent = true;
                            console.log("Invoice sent");
                        }

                        updateLetter(letter);
                    });
                });
            });
        });
    });
}

function sendBill(recipient, letter, fileName, callback) {
    // .price, item.invoiceNumber, item.country, item.pageCount
    var fs = require("fs");
    var pdf = require(config.basePath + "/pdf/pdf_invoice");
    var pdfInvoice = new pdf.PdfInvoice();
    var prefix = app.basePath + '/public/pdf/';
    var path = prefix + fileName;
    var description = letter.pageCount + " pages to " + letter.recipientCountryIso;
    if (letter.pageCount == 1) {
        description = letter.pageCount + " page to " + letter.recipientCountryIso;
    }

    pdfInvoice.createInvoice(recipient, new Date(), letter.invoiceNumber, description, letter.net, letter.vat, letter.price, function (data) {
        fs.writeFile(path, data, function(err) {
            if (err) throw err;
            var email = letter.billingName + ' <' + letter.billingEmail +'>';
            var serverPath = "http://milsapp.com";

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



function updateLetter(letter) {
    db.collection('letter', function(err, collection) {
        collection.update({'_id':letter._id}, letter, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating letter: ' + err);
            } else {
                console.log('' + result + ' document(s) updated');
            }
        });
    });
}
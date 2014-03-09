/**
 * Created by arein on 09/03/14.
 */

var mongo = require('mongodb');
var config = require('./../config')
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

        sendLetters(); // Get started
    }
});

function sendLetters() {
    db.collection('letter', function(err, collection) {
        collection.find({'pdfDelivered': {'$ne': true }, 'sandboxPurchase': false}, function(err, collection) {
            collection.toArray(function (err, letters) {
                console.log("" + letters.length + " letters to be sent");
                if (err) throw err;
                letters.forEach(function(letter) {

                    // Generate Recipient Object
                    var recipient = {
                        name: letter.recipientName,
                        company: letter.recipientCompany,
                        address1: letter.recipientAddress1,
                        address2: letter.recipientAddress2,
                        city: letter.recipientCity,
                        state: letter.recipientState,
                        zip: letter.recipientPostalCode,
                        country: letter.recipientCountryIso,
                        email: letter.billingEmail
                    };

                    var mc = require('./../mail/client');
                    var mailClient = new mc.MailClient();
                    var prefix = config.basePath + '/public/pdf/';
                    mailClient.sendMail(prefix + letter.pdf, recipient, function(err, provider, letterId) {

                        console.log("Letter " + letter._id + " processed");
                        if (err) {
                            console.log("Err: " + err);
                            letter.lastPdfDeliveryError = err;
                            letter.pdfDelivered = false;
                            letter.provider = provider;
                        } else {
                            letter.pdfDelivered = true;
                            letter.pdfId = letterId;
                            letter.provider = provider;
                        }

                        updateLetter(letter); // Store Changes
                    });
                });
            });
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
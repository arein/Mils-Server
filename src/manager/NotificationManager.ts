/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
import mongo = require("mongodb")
import MongoManager = require("./MongoManager")
import Letter = require("./../model/Letter")
import MailManager = require("./MailManager")
import Config = require("./../config")
import ClientType = require("./../model/ClientType")
import LetterRepository = require("./../model/LetterRepository")

class NotificationManager {
    public static notifiyCustomersOfDispatchedDocuments(callback: (numberOfDispatchedLetters: number, numberOfDispatchErrors: number) => void) {
        var dispatchedLetters = 0;
        var dispatchErrors = 0;
        var lettersToDispatch = 0;
        LetterRepository.getPassedToProviderButNotDispatchedLetters(function (letters: Array<Letter>) {
            lettersToDispatch = letters.length;

            if (letters.length === 0) {
                callback(0,0);
            }

            for (var i = 0; i < letters.length; i++) {
                var letter = letters[i];
                MailManager.getDispatchStatusForReference(letter.printInformation.printJobReference, function(error1: Error, dispatchDate: Date) {
                    if (typeof error1 === 'undefined') {
                        letter.printInformation.dispatchedByPrintingProvider = true;
                        letter.printInformation.dispatchedByPrintingProviderAt = dispatchDate;

                        NotificationManager.notifyCustomerViaEmail(letter, function(error2: Error) {
                            if (!error2) {
                                NotificationManager.notifyCustomerViaPushNotification(letter, function (error3: Error) {
                                    if (typeof error3 === 'undefined') {
                                        MongoManager.getDb(function (db:mongo.Db) {
                                            db.collection('letter', function (err:Error, collection) {
                                                collection.update({'_id': letter._id}, letter, {safe: true}, function (error4:Error, result:number) {
                                                    if (err) {
                                                        dispatchErrors++;
                                                        console.log("Error4: " + error4);
                                                    } else {
                                                        dispatchedLetters++;
                                                    }
                                                    if (dispatchedLetters + dispatchErrors === lettersToDispatch) {
                                                        callback(dispatchedLetters, dispatchErrors);
                                                    }
                                                });
                                            });
                                        });
                                    } else {
                                        console.log("Error3: " + error3);
                                        dispatchErrors++;
                                        if (dispatchedLetters + dispatchErrors === lettersToDispatch) {
                                            callback(dispatchedLetters, dispatchErrors);
                                        }
                                    }
                                });
                            } else {
                                console.log("Error2: " + error2);
                                dispatchErrors++;
                                if (dispatchedLetters + dispatchErrors === lettersToDispatch) {
                                    callback(dispatchedLetters, dispatchErrors);
                                }
                            }
                        });

                    } else {
                        console.log("Error1: " + error1);
                        dispatchErrors++;
                        if (dispatchedLetters + dispatchErrors === lettersToDispatch) {
                            callback(dispatchedLetters, dispatchErrors);
                        }
                    }
                });
            }
        });
    }

    public static notifyCustomerViaEmail(letter: Letter, callback: (error: Error) => void) {
        var nodemailer = require("nodemailer");
        var jade = require('jade');
        var dateFormat = require('dateformat');

        var prettyPassedToPrintingProviderAt = dateFormat(letter.printInformation.passedToPrintingProviderAt, "shortDate");
        var prettyDispatchedByPrintingProviderAt = dateFormat(letter.printInformation.passedToPrintingProviderAt, "shortDate");

        var options = { pretty: true,
            destination: letter.recipient.countryIso,
            passedToPrintingProviderAt: prettyPassedToPrintingProviderAt,
            dispatchedByPrintingProviderAt: prettyDispatchedByPrintingProviderAt
        };

        jade.renderFile(Config.getBasePath()  + '/views/dispatched_email.jade', options, function (err, html) {
            if (err) throw err;
            // create reusable transport method (opens pool of SMTP connections)
            var smtpTransport = Config.getNodemailerTransport();

            var message = "Your letter to " + letter.recipient.countryIso + " from " + prettyPassedToPrintingProviderAt + " was dispatched at " + prettyDispatchedByPrintingProviderAt;
            // setup e-mail data with unicode symbols
            var mailOptions = {
                from: "hello@milsapp.com", // sender address
                to: letter.issuer.email, // list of receivers
                subject: "Your Letter was Dispatched", // Subject line
                text: message, // plaintext body
                html: html // html body
            };

            // send mail with defined transport object
            smtpTransport.sendMail(mailOptions, function(error, response){
                // if you don't want to use this transport object anymore, uncomment following line
                smtpTransport.close(); // shut down the connection pool, no more messages
                callback(error);
            });
        });
    }

    /**
     * Currently works with 1 device only due to callback
     * @param letter
     */
    public static notifyCustomerViaPushNotification(letter: Letter, callback: (err?: Error) => void) {
        if (typeof letter.devices !== "undefined") {
            for (var i = 0; i < letter.devices.length; i++) {
                var device = letter.devices[i];
                if (device.type == ClientType.ClientType.Windows81) {
                    var wns = require('wns');

                    var channelUrl = device.uri;
                    var options = {
                        client_id: 'ms-app://s-1-15-2-1797842556-2978483067-2652608984-700972092-662318483-3541751713-3387607526',
                        client_secret: 'OG53FJdqtCkjKt0dtNZyuMrUt2wWhNE6'
                    };

                    wns.sendToastText01(channelUrl, {
                        text1: 'Your letter was successfully dispatched'
                    }, options, function (error, result) {
                        if (error) {
                            callback(error);
                        } else {
                            callback();
                        }
                    });
                } else if (device.type == ClientType.ClientType.MacOS1010) {
                    var apn = require('apn');
                    var prefix = Config.isProd() ? "production" : "sandbox";
                    var opt = {
                        production: Config.isProd(),
                        cert: Config.getBasePath() + "/private/encryption/" + prefix + ".cert.pem",
                        key: Config.getBasePath() + "/private/encryption/" + prefix + ".key.pem"
                    };

                    var apnConnection = new apn.Connection(opt);
                    var myDevice = new apn.Device(device.uri);
                    var note = new apn.Notification();

                    note.expiry = Math.floor(Date.now() / 1000) + 3600 * 24; // Expires 24 hour from now.
                    note.badge = 1;
                    note.alert = "Your letter was dispatched";
                    note.payload = {'remoteLetterId': letter._id};

                    apnConnection.pushNotification(note, myDevice);
                }
            }
        }
    }
}

export = NotificationManager;
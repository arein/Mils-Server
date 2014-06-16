var MailManager = require("./MailManager");
var Config = require("./../config");
var ClientType = require("./../model/ClientType");

var NotificationManager = (function () {
    function NotificationManager() {
    }
    NotificationManager.prototype.notifiyCustomersOfDispatchedDocuments = function () {
        var mm = new MailManager();
        mm.getPassedToProviderButNotDispatchedLetters(function (letters) {
            for (var i = 0; i < letters.length; i++) {
                var letter = letters[i];
                mm.getDispatchStatusForReference(letter.printInformation.printJobReference, function (error, dispatchDate) {
                    if (typeof error === 'undefined') {
                        // TODO: Save the letter
                        letter.printInformation.dispatchedByPrintingProvider = true;
                        letter.printInformation.dispatchedByPrintingProviderAt = dispatchDate;
                        NotificationManager.notifyCustomerViaEmail(letter);
                        NotificationManager.notifyCustomerViaPushNotification(letter);
                    }
                });
            }
        });
    };

    NotificationManager.notifyCustomerViaEmail = function (letter) {
        var nodemailer = require("nodemailer");
        var jade = require('jade');
        var dateFormat = require('dateformat');

        var prettyPassedToPrintingProviderAt = dateFormat(letter.printInformation.passedToPrintingProviderAt, "shortDate");
        var prettyDispatchedByPrintingProviderAt = dateFormat(letter.printInformation.passedToPrintingProviderAt, "shortDate");

        var options = {
            pretty: true,
            destination: letter.recipient.countryIso,
            passedToPrintingProviderAt: prettyPassedToPrintingProviderAt,
            dispatchedByPrintingProviderAt: prettyDispatchedByPrintingProviderAt
        };

        jade.renderFile(Config.getBasePath() + '/views/dispatched_email.jade', options, function (err, html) {
            if (err)
                throw err;

            // create reusable transport method (opens pool of SMTP connections)
            var smtpTransport = Config.getNodemailerTransport();

            var message = "Your letter to " + letter.recipient.countryIso + " from " + prettyPassedToPrintingProviderAt + " was dispatched at " + prettyDispatchedByPrintingProviderAt;

            // setup e-mail data with unicode symbols
            var mailOptions = {
                from: "hello@milsapp.com",
                to: letter.issuer.email,
                subject: "Your Letter was Dispatched",
                text: message,
                html: html
            };

            // send mail with defined transport object
            smtpTransport.sendMail(mailOptions, function (error, response) {
                // if you don't want to use this transport object anymore, uncomment following line
                smtpTransport.close(); // shut down the connection pool, no more messages
                if (error)
                    throw err;
            });
        });
    };

    NotificationManager.notifyCustomerViaPushNotification = function (letter) {
        for (var i = 0; i < letter.devices.length; i++) {
            var device = letter.devices[i];
            if (device.type == 0 /* Windows81 */) {
                var wns = require('wns');

                var channelUrl = device.uri;
                var options = {
                    client_id: 'ms-app://s-1-15-2-1797842556-2978483067-2652608984-700972092-662318483-3541751713-3387607526',
                    client_secret: 'OG53FJdqtCkjKt0dtNZyuMrUt2wWhNE6'
                };

                wns.sendToastText01(channelUrl, {
                    text1: 'Your letter was successfully dispatched'
                }, options, function (error, result) {
                    if (error)
                        console.error(error);
                    else
                        console.log(result);
                });
            }
        }
    };
    return NotificationManager;
})();

module.exports = NotificationManager;
//# sourceMappingURL=NotificationManager.js.map

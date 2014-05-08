/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>

import Letter = require('./../model/Letter')
import Config = require('./../config')
import PdfInvoice = require('./pdf/invoice/PdfInvoice')
class BillHelper {
    public static sendBill(letter : Letter, fileName : string, callback: (err : Error) => void) {
        var fs = require("fs");
        var app = require('./../app');
        var pdfInvoice = new PdfInvoice();
        var prefix = Config.getBasePath() + '/public/pdf/';
        var path = prefix + fileName;

        pdfInvoice.createInvoice(letter, function (data) {
            fs.writeFile(path, data, function(err) {
                if (err) throw err;
                var email = letter.issuer.name + ' <' + letter.issuer.email +'>';
                var serverPath = "https://milsapp.com";

                if (!Config.isProd()) {
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
}

export = BillHelper;
/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
var Config = require('./../config');
var PdfInvoice = require('./pdf/invoice/PdfInvoice');
var BillHelper = (function () {
    function BillHelper() {
    }
    BillHelper.sendBill = function (letter, fileName, callback) {
        var fs = require("fs");
        var app = require('./../app');
        var pdfInvoice = new PdfInvoice();
        var prefix = Config.getBasePath() + '/public/pdf/';
        var path = prefix + fileName;

        pdfInvoice.createInvoice(letter, function (data) {
            fs.writeFile(path, data, function (err) {
                if (err)
                    throw err;
                var email = letter.issuer.name + ' <' + letter.issuer.email + '>';
                var serverPath = "https://milsapp.com";

                if (!Config.isProd()) {
                    email = '"Ceseros" <test@dev.ceseros.de>';
                    serverPath = "http://localhost:3000";
                }

                app.mailer.send('email', {
                    to: email,
                    subject: 'Purchase',
                    invoiceNumber: letter.invoiceNumber,
                    serverPath: serverPath
                }, {
                    attachments: [{ fileName: 'Invoice.pdf', filePath: path }]
                }, callback);
            });
        });
    };
    return BillHelper;
})();

module.exports = BillHelper;
//# sourceMappingURL=BillHelper.js.map

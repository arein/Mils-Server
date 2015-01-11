/// <reference path='./../../../vendor/typescript-node-definitions/node.d.ts'/>
import AbstractSendable = require('./../../model/AbstractSendable');
import Config = require('./../../config');
class PdfWriter {
    writePdf(body: any, sendable: AbstractSendable, callback: (fileSizeInMegabytes: number) => void) {
        var tmp = require('tmp');
        var prefix = Config.getBasePath() + '/public/pdf/';
        tmp.tmpName({ template: prefix + 'letter-XXXXXX.pdf' }, function _tempNameGenerated(err, path) {
            if (err) throw err;
            // Write PDF to File
            if (typeof body.pages !== "undefined") {
                var PDFDocument = require('pdfkit');
                var doc = new PDFDocument({size: 'A4'});
                doc.image(new Buffer(body.pages[0].image, 'base64'), 0, 0, {fit: [595.28, 841.89]});
                if (body.signature !== 'undefined' && body.signature != null) {
                    var signature = new Buffer(body.signature, 'base64');
                    addSignatures(signature, doc, body.pages[0].signatures);
                }
                for (var i = 1; i < body.pages.length; i++) {
                    doc.addPage();
                    doc.image(new Buffer(body.pages[i].image, 'base64'), 0, 0, {fit: [595.28, 841.89]});
                    addSignatures(signature, doc, body.pages[i].signatures);
                }
                // Write the File
                doc.output(function(data) {
                    var fs = require('fs');
                    fs.writeFile(path, data, function(err) {
                        if (err) throw err;
                        sendable.pdf = path.replace(prefix, ''); // "Repair Path"
                        sendable.pageCount = body.pages.length;
                        checkSize(sendable, callback);
                    });
                });
            } else {
                var fs = require('fs');
                var buf = new Buffer(body.pdf, 'base64');
                fs.writeFile(path, buf, function (err) {
                    if (err) throw err;

                    sendable.pdf = path.replace(prefix, ''); // "Repair Path"
                    var PFParser = require("pdf2json");
                    var pdfParser = new PFParser();
                    pdfParser.on("pdfParser_dataReady", function(data) {
                        sendable.pageCount = data.PDFJS.pages.length;
                        checkSize(sendable, callback);
                    });
                    pdfParser.on("pdfParser_dataError", function (error) {
                        throw error;
                    });
                    pdfParser.loadPDF(path);
                });
            }
        });
    }
}

function checkSize(sendable: AbstractSendable, callback: (fileSizeInMegabytes: number) => void) {
    var fs = require('fs');
    var prefix = Config.getBasePath() + '/public/pdf/';

    var stats = fs.statSync(prefix + sendable.pdf);
    var fileSizeInBytes = stats["size"];
    //Convert the file size to megabytes (optional)
    var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    callback(fileSizeInMegabytes);
}

function addSignatures(buffer, doc, signatures) {
    var scaleFactor = 1.0101968821;
    for (var i = 0; i < signatures.length; i++) {
        doc.image(buffer, signatures[i].x, signatures[i].y * scaleFactor, {width: signatures[i].width, height: signatures[i].height * scaleFactor});
    }
}

export  = PdfWriter;
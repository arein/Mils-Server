var Config = require('./../../config');
var PdfWriter = (function () {
    function PdfWriter() {
    }
    PdfWriter.prototype.writePdf = function (body, letter, callback) {
        var tmp = require('tmp');
        var prefix = Config.getBasePath() + '/public/pdf/';
        tmp.tmpName({ template: prefix + 'letter-XXXXXX.pdf' }, function _tempNameGenerated(err, path) {
            if (err)
                throw err;

            // Write PDF to File
            if (typeof body.pages !== "undefined") {
                var PDFDocument = require('pdfkit');
                var doc = new PDFDocument({ size: 'A4' });
                doc.image(new Buffer(body.pages[0].image, 'base64'), 0, 0, { fit: [595.28, 841.89] });
                if (typeof body.signature !== "undefined") {
                    var signature = new Buffer(body.signature, 'base64');
                    addSignatures(signature, doc, body.pages[0].signatures);
                }
                for (var i = 1; i < body.pages.length; i++) {
                    doc.addPage();
                    doc.image(new Buffer(body.pages[i].image, 'base64'), 0, 0, { fit: [595.28, 841.89] });
                    addSignatures(signature, doc, body.pages[i].signatures);
                }

                // Write the File
                doc.output(function (data) {
                    var fs = require('fs');
                    fs.writeFile(path, data, function (err) {
                        if (err)
                            throw err;
                        letter.pdf = path.replace(prefix, ''); // "Repair Path"
                        letter.pageCount = body.pages.length;
                        checkSize(letter, callback);
                    });
                });
            } else {
                var fs = require('fs');
                var buf = new Buffer(body.pdf, 'base64');
                fs.writeFile(path, buf, function (err) {
                    if (err)
                        throw err;

                    letter.pdf = path.replace(prefix, ''); // "Repair Path"
                    var PFParser = require("pdf2json");
                    var pdfParser = new PFParser();
                    pdfParser.on("pdfParser_dataReady", function (data) {
                        letter.pageCount = data.PDFJS.pages.length;
                        checkSize(letter, callback);
                    });
                    pdfParser.on("pdfParser_dataError", function (error) {
                        throw error;
                    });
                    pdfParser.loadPDF(path);
                });
            }
        });
    };
    return PdfWriter;
})();

function checkSize(letter, callback) {
    var fs = require('fs');
    var prefix = Config.getBasePath() + '/public/pdf/';

    var stats = fs.statSync(prefix + letter.pdf);
    var fileSizeInBytes = stats["size"];

    //Convert the file size to megabytes (optional)
    var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    callback(fileSizeInMegabytes);
}

function addSignatures(buffer, doc, signatures) {
    var scaleFactor = 1.0101968821;
    for (var i = 0; i < signatures.length; i++) {
        doc.image(buffer, signatures[i].x, signatures[i].y * scaleFactor, { width: signatures[i].width, height: signatures[i].height * scaleFactor });
    }
}

module.exports = PdfWriter;
//# sourceMappingURL=PdfWriter.js.map

/// <reference path='./../../../vendor/typescript-node-definitions/node.d.ts'/>
var Config = require("./../../config");
var PdfColorInspector = (function () {
    function PdfColorInspector() {
        this.pagesProcessed = 0;
        this.pagesToProcess = 0;
        this.isGrayscale = true;
    }
    PdfColorInspector.prototype.canApplyGrayscale = function (pathToPdf, callback) {
        // Determine the number of pages
        var PFParser = require("pdf2json");
        var pdfParser = new PFParser();
        var that = this;

        var conclude = function (isGrayscale) {
            if (!isGrayscale)
                that.isGrayscale = false;
            that.pagesProcessed++;

            if (that.pagesProcessed === that.pagesToProcess) {
                callback(that.isGrayscale);
            }
        };

        pdfParser.on("pdfParser_dataReady", function (data) {
            that.pagesToProcess = data.PDFJS.pages.length;

            for (var i = 1; i <= that.pagesToProcess; i++) {
                // Render PNG with GhostScript
                that.determineGreyscaleForPage(pathToPdf, i, conclude);
            }
        });
        pdfParser.on("pdfParser_dataError", function (error) {
            throw error;
        });
        pdfParser.loadPDF(pathToPdf);
    };

    PdfColorInspector.prototype.determineGreyscaleForPage = function (pathToPdf, pageNumber, callback) {
        var exec = require('child_process').exec;

        var filename = pathToPdf.match(/([a-zA-Z0-9]*)\.pdf/)[1];
        var pathToGhostScript = Config.isProd() ? "/usr/bin/gs" : "/usr/local/bin/gs";
        var pathToPng = Config.getBasePath() + '/util/colorinspector/tmp/' + filename + '[page].png';

        var command = (pathToGhostScript + " -dQUIET -dPARANOIDSAFER -dBATCH -dNOPAUSE -dNOPROMPT -sDEVICE=png16m -dTextAlphaBits=4 -dGraphicsAlphaBits=4 -r72 -dFirstPage=[page] -dLastPage=[page] -sOutputFile=" + pathToPng + " " + pathToPdf);
        command = command.replace(/\[page\]/g, pageNumber + "");
        exec(command, function (error, stdout, stderr) {
            if (error !== null) {
                throw error;
            } else {
                var histogram = require('histogram');
                histogram(pathToPng.replace("[page]", pageNumber + ""), function (err, data) {
                    if (err)
                        throw err;
                    var fs = require("fs");
                    fs.unlink(pathToPng.replace("[page]", pageNumber + ""), function (err) {
                        if (err)
                            throw err;
                        callback(data.greyscale);
                    });
                });
            }
        });
    };
    return PdfColorInspector;
})();

module.exports = PdfColorInspector;
//# sourceMappingURL=PdfColorInspector.js.map

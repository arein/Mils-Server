var PdfColorInspector = require("./../../src/util/colorinspector/PdfColorInspector");
var Config = require("./../../src/config");

describe("Grayscale Identification", function () {
    it("Determine Grayscale", function () {

        var filepath = Config.getBaseTestPath() + "/assets/GrayscalePdf1.pdf"

        var ci = new PdfColorInspector();
        ci.canApplyGrayscale(filepath, function (isGrayscale) {
            console.log("Should be grayscale === true?", isGrayscale);
            expect(isGrayscale).toBe(true);
        });
    });

    it("Determine Not Grayscale", function () {

        var filepath = Config.getBaseTestPath() + "/assets/GrayscalePdf2.pdf"

        var ci = new PdfColorInspector();
        ci.canApplyGrayscale(filepath, function (isGrayscale) {
            console.log("Should not be grayscale === true?", !isGrayscale);
            expect(isGrayscale).toBe(true);
        });
    });
});
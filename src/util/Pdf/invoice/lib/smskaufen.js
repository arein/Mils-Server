/**
 * New node file
 */

// Constructor
function SmsKaufenPdf() {
}
// class methods
SmsKaufenPdf.prototype.createFinalPdf = function() {
	var fs = require('fs');
	var exec = require('child_process').exec;
	var filename = "Sample";
	exec("/usr/local/bin/gs -dQUIET -dPARANOIDSAFER -dBATCH -dNOPAUSE -dNOPROMPT -sDEVICE=png16m -dTextAlphaBits=4 -dGraphicsAlphaBits=4 -r72 -dFirstPage=1 -dLastPage=1 -sOutputFile=./"+filename+".png ./"+filename+".pdf", function (error, stdout, stderr) {
		if (error) throw error;
	});
};

// export the class
exports.SmsKaufenPdf = SmsKaufenPdf;



(function () {
	var s = new SmsKaufenPdf();
	s.createFinalPdf();
})();
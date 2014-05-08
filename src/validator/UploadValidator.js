var UploadValidator = (function () {
    function UploadValidator() {
    }
    UploadValidator.validate = function (req) {
        var check = require('validator').check, sanitize = require('validator').sanitize;

        check(req.body.pdf).notNull();
        check(req.body.recipientName).notNull();
        check(req.body.recipientAddress1).notNull();
        check(req.body.recipientCity).notNull();
        check(req.body.recipientPostalCode).notNull();
        check(req.body.recipientCountryIso).notNull();
    };
    return UploadValidator;
})();

module.exports = UploadValidator;
//# sourceMappingURL=UploadValidator.js.map

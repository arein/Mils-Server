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
        if (req.body.recipientName.length > 50)
            throw new Error("The Recipient Name may not be longer than 50 characters");
        if (req.body.recipientCompany.length > 50)
            throw new Error("The Recipient Company may not be longer than 50 characters");
        if (req.body.recipientAddress1.length > 50)
            throw new Error("The Recipient Address Line 1 may not be longer than 50 characters");
        if (req.body.recipientAddress2.length > 50)
            throw new Error("The Recipient Address Line 2 may not be longer than 50 characters");
        if (req.body.recipientCity.length > 50)
            throw new Error("The Recipient City may not be longer than 50 characters");
        if (req.body.recipientState.length > 50)
            throw new Error("The Recipient State may not be longer than 50 characters");
        if (req.body.recipientPostalCode.length > 50)
            throw new Error("The Recipient Zip may not be longer than 50 characters");

        // Sanitize
        req.body.recipientName = sanitize(req.body.recipientName).trim();
        req.body.recipientName = sanitize(req.body.recipientName).escape();
        req.body.recipientName = req.body.recipientName.replace("'", '').replace('"', '');

        req.body.recipientCompany = (typeof req.body.recipientCompany === 'undefined') ? undefined : sanitize(req.body.recipientCompany).trim();
        req.body.recipientCompany = (typeof req.body.recipientCompany === 'undefined') ? undefined : sanitize(req.body.recipientCompany).escape();
        req.body.recipientCompany = (typeof req.body.recipientCompany === 'undefined') ? undefined : req.body.recipientCompany.replace("'", '').replace('"', '');

        req.body.recipientAddress1 = sanitize(req.body.recipientAddress1).trim();
        req.body.recipientAddress1 = sanitize(req.body.recipientAddress1).escape();
        req.body.recipientAddress1 = req.body.recipientAddress1.replace("'", '').replace('"', '');

        req.body.recipientAddress2 = (typeof req.body.recipientAddress2 === 'undefined') ? undefined : sanitize(req.body.recipientAddress2).trim();
        req.body.recipientAddress2 = (typeof req.body.recipientAddress2 === 'undefined') ? undefined : sanitize(req.body.recipientAddress2).escape();
        req.body.recipientAddress2 = (typeof req.body.recipientAddress2 === 'undefined') ? undefined : req.body.recipientAddress2.replace("'", '').replace('"', '');

        req.body.recipientPostalCode = sanitize(req.body.recipientPostalCode).trim();
        req.body.recipientPostalCode = sanitize(req.body.recipientPostalCode).escape();
        req.body.recipientPostalCode = req.body.recipientPostalCode.replace("'", '').replace('"', '');

        req.body.recipientCity = sanitize(req.body.recipientCity).trim();
        req.body.recipientCity = sanitize(req.body.recipientCity).escape();
        req.body.recipientCity = req.body.recipientCity.replace("'", '').replace('"', '');

        req.body.recipientCountryIso = (typeof req.body.recipientCountryIso === 'undefined') ? undefined : sanitize(req.body.recipientCountryIso).escape();
    };
    return UploadValidator;
})();

module.exports = UploadValidator;
//# sourceMappingURL=UploadValidator.js.map

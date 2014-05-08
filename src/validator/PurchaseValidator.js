var PurchaseValidator = (function () {
    function PurchaseValidator() {
    }
    PurchaseValidator.validate = function (req) {
        var check = require('validator').check, sanitize = require('validator').sanitize;

        check(req.params.id).notNull();
        check(req.body).notNull();
        check(req.body.emailAddress).notNull().isEmail();
        check(req.body.address).notNull();
        check(req.body.creditCard).notNull();
        check(req.body.creditCard.number).notNull();
        req.body.creditCard.type = undefined; // we do not need this input
        check(req.body.creditCard.cvv).notNull();
        check(req.body.creditCard.date).notNull();
        check(req.body.address.name).notNull();
        check(req.body.address.line1).notNull();
        check(req.body.address.postalCode).notNull();
        check(req.body.address.city).notNull();
        check(req.body.address.country).notNull();
    };
    return PurchaseValidator;
})();

module.exports = PurchaseValidator;
//# sourceMappingURL=PurchaseValidator.js.map

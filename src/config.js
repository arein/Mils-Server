/// <reference path='./../vendor/typescript-node-definitions/node.d.ts'/>
/**
* Created by arein on 09/03/14.
*/
var Config = (function () {
    function Config() {
    }
    Config.getBasePath = function () {
        if (Config.isProd()) {
            return "/var/www/letterapp/src";
        }

        return "/Users/arein/node/letterapp/src";
    };
    Config.getBaseTestPath = function () {
        if (Config.isProd()) {
            return "/var/www/letterapp/test";
        }

        return "/Users/arein/node/letterapp/test";
    };

    Config.isProd = function () {
        if (process.env.NODE_ENV != undefined && process.env.NODE_ENV.toLowerCase() == 'production') {
            return true;
        }

        return false;
    };

    Config.getNodemailerTransport = function () {
        var nodemailer = require("nodemailer");

        // create reusable transport method (opens pool of SMTP connections)
        var smtpTransport = nodemailer.createTransport("SMTP", {
            host: "intern.ceseros.de",
            secureConnection: false,
            port: 25,
            auth: {
                user: "hello@milsapp.com",
                pass: "Mk72TBbL"
            }
        });

        return smtpTransport;
    };

    Config.getBaseUri = function () {
        if (Config.isProd())
            return "https://milsapp.com";

        return "http://localhost:3000";
    };

    Config.getCurrencyConverterAppId = function () {
        return "c9b5a882d43146918ebe0afdd978fbe8";
    };

    Config.getBraintreeSandboxConfig = function (environment) {
        return {
            environment: environment,
            merchantId: "7sj5c56hggvmgrfw",
            publicKey: "78rfb5jwd4877d48",
            privateKey: "333775c67b6af31779a8bc9e8c529b31"
        };
    };

    Config.getBraintreeProductionConfig = function (environment) {
        return {
            environment: environment,
            merchantId: "krf85rj993z3mj7n",
            publicKey: "9nnsbrqv7nbvd4wq",
            privateKey: "a2e371f67b9839d5e8fd5b6685bb3a31"
        };
    };

    Config.getGoogleAPIKey = function () {
        return "AIzaSyDTVeZO2Oqr_80tLrlPWVFfZOL0KOeCXEo";
    };
    return Config;
})();

module.exports = Config;
//# sourceMappingURL=config.js.map

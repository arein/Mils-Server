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
    return Config;
})();

module.exports = Config;
//# sourceMappingURL=config.js.map

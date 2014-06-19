/// <reference path='./../vendor/typescript-node-definitions/node.d.ts'/>
/**
 * Created by arein on 09/03/14.
 */
class Config {
    public static getBasePath() {
        if (Config.isProd()) {
            return "/var/www/letterapp/src";
        }

        return "/Users/arein/node/letterapp/src";
    }
    public static getBaseTestPath() {
        if (Config.isProd()) {
            return "/var/www/letterapp/test";
        }

        return "/Users/arein/node/letterapp/test";
    }

    public static isProd() {
        if (process.env.NODE_ENV != undefined && process.env.NODE_ENV.toLowerCase() == 'production') {
            return true;
        }

        return false;
    }

    public static getNodemailerTransport() {
        var nodemailer = require("nodemailer");

        // create reusable transport method (opens pool of SMTP connections)
        var smtpTransport = nodemailer.createTransport("SMTP",{
            host: "intern.ceseros.de",
            secureConnection: false,
            port: 25,
            auth: {
                user: "hello@milsapp.com",
                pass: "Mk72TBbL"
            }
        });

        return smtpTransport;
    }
}

export = Config;
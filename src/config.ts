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

    public static getBaseUri(): string {
        if (Config.isProd()) return "https://milsapp.com";

        return "http://localhost:3000";
    }

    public static getCurrencyConverterAppId() : string {
        return "c9b5a882d43146918ebe0afdd978fbe8";
    }

    public static getBraintreeSandboxConfig(environment: any) : any {
        return {
            environment: environment,
            merchantId: "7sj5c56hggvmgrfw",
            publicKey: "78rfb5jwd4877d48",
            privateKey: "333775c67b6af31779a8bc9e8c529b31"
        };
    }

    public static getBraintreeProductionConfig(environment: any) : any {
        return {
            environment: environment,
            merchantId: "krf85rj993z3mj7n",
            publicKey: "9nnsbrqv7nbvd4wq",
            privateKey: "a2e371f67b9839d5e8fd5b6685bb3a31"
        };
    }

    public static getGoogleAPIKey() : string {
        return "AIzaSyDTVeZO2Oqr_80tLrlPWVFfZOL0KOeCXEo";
    }
}

export = Config;
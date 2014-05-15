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

    public static isProd() {
        if (process.env.NODE_ENV != undefined && process.env.NODE_ENV.toLowerCase() == 'production') {
            return true;
        }

        return false;
    }
}

export = Config;
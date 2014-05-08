/// <reference path='./../vendor/typescript-node-definitions/node.d.ts'/>
/**
 * Created by arein on 09/03/14.
 */
class Config {
    basePath() {
        if (process.env.NODE_ENV != undefined && process.env.NODE_ENV.toLowerCase() == 'production') {
            return "/var/www/letterapp";
        }

        return "/Users/arein/node/letterapp";
    }
}

export = Config;
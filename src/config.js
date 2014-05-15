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

    Config.isProd = function () {
        if (process.env.NODE_ENV != undefined && process.env.NODE_ENV.toLowerCase() == 'production') {
            return true;
        }

        return false;
    };
    return Config;
})();

module.exports = Config;
//# sourceMappingURL=config.js.map

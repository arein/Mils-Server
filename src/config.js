/// <reference path='./../vendor/typescript-node-definitions/node.d.ts'/>
/**
* Created by arein on 09/03/14.
*/
var Config = (function () {
    function Config() {
    }
    Config.prototype.basePath = function () {
        if (process.env.NODE_ENV != undefined && process.env.NODE_ENV.toLowerCase() == 'production') {
            return "/var/www/letterapp";
        }

        return "/Users/arein/node/letterapp";
    };
    return Config;
})();

module.exports = Config;
//# sourceMappingURL=config.js.map

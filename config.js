/**
 * Created by arein on 09/03/14.
 */

var config = {};

config.basePath = (function () {
    console.log("Env: " + process.env.NODE_ENV);
    if (process.env.NODE_ENV != undefined && process.env.NODE_ENV.toLowerCase() == 'production') {
        return "/var/www/letterapp";
    }

    return "/Users/arein/node/letterapp";
}());

module.exports = config;
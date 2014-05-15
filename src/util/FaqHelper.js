/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
var Config = require('./../config');
var FaqHelper = (function () {
    function FaqHelper() {
    }
    FaqHelper.getFaqRecords = function (callback) {
        var fs = require('fs');

        var dir = Config.getBasePath() + '/views/faq';
        var data = [];

        fs.readdir(dir, function (err, files) {
            if (err) {
                callback(err);
                return;
            }
            files.forEach(function (file) {
                if (file.match(/.jade$/) && file != "layout.jade") {
                    var match = file.match(/(.*).jade$/);
                    var f = {
                        link: match[1],
                        name: uppercasify(match[1])
                    };
                    data.push(f);
                }
            });

            callback(undefined, data);
        });
    };
    return FaqHelper;
})();

function uppercasify(input) {
    var arr = input.split("-");
    var count = 0;
    var arr = arr.map(function (word) {
        if (count++ == 0 || word.length >= 4) {
            var v = word.substr(0, 1).toUpperCase() + word.substr(1);
            return v;
        }
        return word;
    });
    return arr.join(" ");
}

module.exports = FaqHelper;
//# sourceMappingURL=FaqHelper.js.map

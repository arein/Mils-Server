/// <reference path='./../../vendor/typescript-node-definitions/node.d.ts'/>
import Config = require('./../config')
class FaqHelper {
    public static getFaqRecords() {
        var fs=require('fs');

        var dir= Config.getBasePath() + '/views/faq';
        var data=[];

        var files = fs.readdirSync(dir);
        files.forEach(function(file){
            if (file.match(/.jade$/) && file != "layout.jade") {
                var match = file.match(/(.*).jade$/);
                var f = {
                    link: match[1],
                    name: uppercasify(match[1])
                };
                data.push(f);
            }
        });

        return data;
    }
}

function uppercasify(input: string) {
    var arr = input.split("-");
    var count = 0;
    var arr = arr.map(function(word: string) {
        if (count++ == 0 || word.length >= 4) {
            var v = word.substr(0,1).toUpperCase() + word.substr(1);
            return v;
        }
        return word;
    });
    return arr.join(" ");
}

export = FaqHelper;
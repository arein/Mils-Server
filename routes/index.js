
/*
 * GET home page.
 */

exports.index = function(req, res) {
    var countries = getCountries(function (data) {
        res.render('index', {countries: data});
    });
};

function getCountries(callback) {
    var csv = require('csv');
    csv()
        .from.path(__dirname+'/../private/ISO3166.txt', { delimiter: ';'})
        .to.array(function(data){
            callback(data);
        })
        .transform( function(row){
            row.unshift(row.pop());
            return row;
        });
}

exports.pricing = function(req, res) {
    var countries = getCountries(function (data) {
        res.render('pricing', {countries: data});
    });
};

exports.faq = function(req, res) {
    res.render('faq');
};

exports.blog = function(req, res) {
    res.render('blog');
};

exports.howitworks = function(req, res) {
    res.render('howitworks');
};
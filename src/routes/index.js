var config = require("./../config");

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

exports.imprint = function(req, res) {
    res.render('imprint');
};

exports.contact = function(req, res) {
    res.render('contact');
};

exports.howitworks = function(req, res) {
    res.render('howitworks');
};

var path = require('path');
var mime = require('mime');

exports.osxDownload = function(req, res) {
    var app = require('./../app');
    var file = config.basePath + '/public/downloads/Mils.app.zip';
    res.download(file)
};
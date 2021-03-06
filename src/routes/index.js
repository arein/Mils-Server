var config = require("./../config");

exports.index = function(req, res) {
    var countries = getCountries(function (data) {
        res.render('index', {countries: data, osInfo: getOsInformation(req)});
    });
};

function getOsInformation(req) {
    var ua = req.headers['user-agent'];
    var info = {
        isMacOsX: false,
        isWindows8: false
    };

    if (/Mac OS X 10_[9|10|11|12|13|14|15]/.test(ua)) {
        info.isMacOsX = true;
    }

    if (/Windows NT 6.[2-9]/.test(ua)) {
        info.isWindows8 = true;
    }

    return info;
}

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
    var helper = require('./../util/FaqHelper');
    var data = helper.getFaqRecords();
    res.render('faq', {data: data});
};

exports.faqSub = function (req, res) {
    var title = req.params.title;
    var fs = require("fs");
    var path = config.getBasePath() + '/views/faq/' + title + '.jade';
    fs.exists(path, function (exists) {
        if (exists) {
            res.render('faq/' + title);
        } else {
            res.render(404);
        }
    });
};

exports.blog = function(req, res) {
    res.render('blog');
};

exports.aboutMils = function(req, res) {
    res.render('aboutmils');
};

exports.imprint = function(req, res) {
    res.render('imprint');
};

exports.contact = function(req, res) {
    res.render('contact');
};

var path = require('path');
var mime = require('mime');

exports.osxDownload = function(req, res) {
    var app = require('./../app');
    var file = config.getBasePath() + '/public/downloads/Mils.app.zip';
    res.download(file)
};
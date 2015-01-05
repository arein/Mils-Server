var express = require("express");
var mongo = require('mongodb');
var Config = require("./../config");
/*
 * GET users listing.
 */


var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('letterdb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        var credentials = Config.getMongoCredentials();
        db.authenticate(credentials.user, credentials.pwd, function (err, res) {
            if (err) {
                console.log("Couldn't authenticate to the db: " + err);
                throw err;
            }
            db.createCollection('letter', {strict:true}, function(err, collection) {
                if (!err) {
                    console.log("The letter collection doesn't exist. Creating it with sample data");
                }
            });

            db.createCollection('counters', {strict:true}, function(err, collection) {
                if (!err) {
                    console.log("Counters Collection created. Creating it with sample data");
                }
            });
        });
    }
});

exports.index = function(req, res) {
    var monthly, recipientCountry, billingCountry;
    getMonthlyReportData(function (err, result) {
        monthly = result;
        respond(res, monthly, recipientCountry, billingCountry);
    });

    getCountryReportData("$recipient.countryIso", function(err, result) {
        recipientCountry = result;
        respond(res, monthly, recipientCountry, billingCountry);
    });

    getCountryReportData("$issuer.country", function(err, result) {
        billingCountry = result;
        respond(res, monthly, recipientCountry, billingCountry);
    });
};

function respond(res, monthly, recipientCountry, billingCountry) {
    if (monthly == undefined || recipientCountry == undefined || billingCountry == undefined) return;
    res.render('admin', {
        'monthly': monthly,
        'recipientCountry': recipientCountry,
        'billingCountry': billingCountry
    });
}

function getMonthlyReportData(callback) {
    db.collection('letter', function(err, collection) {
        collection.aggregate(
            [{
                $match: { "payed": true }
            },
            {
                $sort: { "createdAt": -1 }
            },
            { $group : {
                _id: {
                    year : { $year : "$createdAt" },
                    month : { $month : "$createdAt" }
                },
                count: { $sum: 1 },
                priceTotal: { $sum: "$financialInformation.priceInAud" },
                priceAvg: { $avg: "$financialInformation.priceInAud" },
                pagesTotal: { $sum: "$pageCount" },
                pagesAvg: { $avg: "$pageCount" },
                netTotal: { $sum: "$financialInformation.net" },
                netAvg: { $avg: "$financialInformation.net" },
                vatTotal: { $sum: "$financialInformation.vat" },
                vatAvg: { $avg: "$financialInformation.vat" },
                marginAppliedTotal: { $sum: "$financialInformation.margin" },
                marginAppliedAvg: { $avg: "$financialInformation.margin" },
                printingPriceTotal: { $sum: "$financialInformation.printingCostInAud" },
                printingPriceAvg: { $avg: "$financialInformation.printingCostInAud" },
                vatIncomeTotal: { $sum: "$financialInformation.vatIncome" },
                vatIncomeAvg: { $avg: "$financialInformation.vatIncome" }
            }}],
            callback);
    });
}

function getCountryReportData(value, callback) {
    db.collection('letter', function(err, collection) {
        collection.aggregate(
            [{
                $match: { "payed": true }
            },
            {
                $sort: { "createdAt": -1 }
            },
            { $group : {
                _id: {
                    recipientCountry : value
                },
                count: { $sum: 1 }
            }}],
            callback);
    });
}
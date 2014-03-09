var express = require("express");
var mongo = require('mongodb');
/*
 * GET users listing.
 */


var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('letterdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to winedb database");
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
    }
});

exports.index = function(req, res) {
    getMonthlyReportData(function (err, result) {
        console.log(result);
        res.render('admin', { 'monthly': result });
    });
};

function getMonthlyReportData(callback) {
    db.collection('letter', function(err, collection) {
        collection.aggregate(
            { $sort: { "createdAt": -1 }},
            { $group : {
                _id: {
                    year : { $year : "$createdAt" },
                    month : { $month : "$createdAt" }
                },
                count: { $sum: 1 },
                priceTotal: { $sum: "$price" },
                priceAvg: { $avg: "$price" },
                pagesTotal: { $sum: "$pageCount" },
                pagesAvg: { $avg: "$pageCount" },
                netTotal: { $sum: "$net" },
                netAvg: { $avg: "$net" },
                vatTotal: { $sum: "$vat" },
                vatAvg: { $avg: "$vat" }
            }},
            callback);
    });
}
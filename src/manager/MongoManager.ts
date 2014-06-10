/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
import mongo = require("mongodb")

class MongoManager {
    private static populateDB(callback : (result : any) => void) {

        var counters = [{
            _id: "invoicenumber",
            seq: 15000
        }];

        MongoManager.getDb(function (db : mongo.Db) {
            db.collection('counters', function (err, collection) {
                collection.insert(counters, {safe: true}, function (err, result) {
                    callback(result);
                });
            });
        });
    }

    public static getNextSequence(name : string, callback : (sequence : number) => void) {
        MongoManager.getDb(function (db : mongo.Db) {
            db.collection('counters', function (err, collection) {
                collection.findAndModify({ _id: name }, [
                    ['_id', 'asc']
                ], { $inc: { seq: 1 } }, {new: true}, function (error, item) {
                    if (err) throw err;
                    if (item == null || typeof item === "undefined") {
                        MongoManager.populateDB(function (result : any) {
                            callback(result.seq);
                        });
                    } else {
                        callback(item.seq);
                    }
                });
            });
        });
    }

    private static db : mongo.Db;

    public static getDb(callback : (db : mongo.Db) => void) {

        if (MongoManager.db) {
            callback(MongoManager.db);
            return;
        }

        var server : mongo.Server = new mongo.Server('localhost', 27017, {auto_reconnect: true});
        var db : mongo.Db = new mongo.Db('letterdb', server);

        db.open(function(err : Error, db : mongo.Db) {
            if(!err) {
                db.createCollection('letter', {strict:true}, function(err : Error, collection : mongo.Collection) {
                    if (!err) {
                        console.log("The letter collection doesn't exist. Creating it with sample data");
                    }
                });

                db.createCollection('counters', {strict:true}, function(err : Error, collection : mongo.Collection) {
                    if (!err) {
                        console.log("Counters Collection created. Creating it with sample data");
                        this.populateDB();
                    }
                });
                callback(db);
            } else {
                throw err;
            }
        });
    }
}

export = MongoManager;
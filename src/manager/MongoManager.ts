/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
import mongo = require("mongodb")

class MongoManager {
    server : mongo.Server;
    db : mongo.Db;
    constructor() {
        this.server = new mongo.Server('localhost', 27017, {auto_reconnect: true});
        this.db = new mongo.Db('letterdb', this.server);

        this.db.open(function(err : Error, db : mongo.Db) {
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
            }
        });
    }

    populateDB() {

        var counters = [{
            _id: "invoicenumber",
            seq: 15000
        }];

        this.db.collection('counters', function(err, collection) {
            collection.insert(counters, {safe:true}, function(err, result) {});
        });

    }

    getNextSequence(name : string, callback : (sequence : number) => void) {
        this.db.collection('counters', function(err, collection) {
            collection.findAndModify({ _id: name }, [['_id','asc']], { $inc: { seq: 1 } }, {new: true}, function(error, item) {
                if (err) throw err;
                callback(item.seq);
            });
        });
    }

    private static instance : MongoManager;

    public static getInstance() {
        if (typeof MongoManager.instance === 'undefined') {
            MongoManager.instance = new MongoManager();
        }

        return MongoManager.instance;
    }
}

export = MongoManager;
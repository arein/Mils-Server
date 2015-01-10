/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
var mongo = require("mongodb");
var Config = require("./../config");

var MongoManager = (function () {
    function MongoManager() {
    }
    MongoManager.populateDB = function (callback) {
        var counters = [{
                _id: "invoicenumber",
                seq: 15000
            }];

        MongoManager.getDb(function (db) {
            db.collection('counters', function (err, collection) {
                collection.insert(counters, { safe: true }, function (err, result) {
                    callback(result);
                });
            });
        });
    };

    MongoManager.getNextSequence = function (name, callback) {
        MongoManager.getDb(function (db) {
            db.collection('counters', function (err, collection) {
                collection.findAndModify({ _id: name }, [
                    ['_id', 'asc']
                ], { $inc: { seq: 1 } }, { new: true }, function (error, item) {
                    if (err)
                        throw err;
                    if (item == null || typeof item === "undefined") {
                        MongoManager.populateDB(function (result) {
                            callback(result.seq);
                        });
                    } else {
                        callback(item.seq);
                    }
                });
            });
        });
    };

    MongoManager.getDb = function (callback) {
        if (MongoManager.db) {
            callback(MongoManager.db);
            return;
        }

        var server = new mongo.Server('localhost', 27017, { auto_reconnect: true });
        var db = new mongo.Db('letterdb', server, { safe: true });

        db.open(function (err, db) {
            if (!err) {
                var credentials = Config.getMongoCredentials();
                db.authenticate(credentials.user, credentials.pwd, function (err, res) {
                    if (err) {
                        console.log("Couldn't authenticate to the db: " + err);
                        throw err;
                    }
                    db.createCollection('letter', { strict: true }, function (err, collection) {
                        if (!err) {
                            console.log("The letter collection doesn't exist. Creating it with sample data");
                        }
                    });

                    db.createCollection('fax', { strict: true }, function (err, collection) {
                        if (!err) {
                            console.log("The fax collection doesn't exist. Creating it with sample data");
                        }
                    });

                    db.createCollection('counters', { strict: true }, function (err, collection) {
                        if (!err) {
                            console.log("Counters Collection created. Creating it with sample data");
                            this.populateDB();
                        }
                    });
                    callback(db);
                });
            } else {
                throw err;
            }
        });
    };
    return MongoManager;
})();

module.exports = MongoManager;
//# sourceMappingURL=MongoManager.js.map

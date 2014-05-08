/// <reference path='./../../vendor/typescript-node-definitions/mongodb.d.ts'/>
var mongo = require("mongodb");

var MongoManager = (function () {
    function MongoManager() {
        this.server = new mongo.Server('localhost', 27017, { auto_reconnect: true });
        this.db = new mongo.Db('letterdb', this.server);

        this.db.open(function (err, db) {
            if (!err) {
                db.createCollection('letter', { strict: true }, function (err, collection) {
                    if (!err) {
                        console.log("The letter collection doesn't exist. Creating it with sample data");
                    }
                });

                db.createCollection('counters', { strict: true }, function (err, collection) {
                    if (!err) {
                        console.log("Counters Collection created. Creating it with sample data");
                        this.populateDB();
                    }
                });
            }
        });
    }
    MongoManager.prototype.populateDB = function () {
        var counters = [{
                _id: "invoicenumber",
                seq: 15000
            }];

        this.db.collection('counters', function (err, collection) {
            collection.insert(counters, { safe: true }, function (err, result) {
            });
        });
    };

    MongoManager.prototype.getNextSequence = function (name, callback) {
        this.db.collection('counters', function (err, collection) {
            collection.findAndModify({ _id: name }, [['_id', 'asc']], { $inc: { seq: 1 } }, { new: true }, function (error, item) {
                if (err)
                    throw err;
                callback(item.seq);
            });
        });
    };

    MongoManager.getInstance = function () {
        if (typeof MongoManager.instance === 'undefined') {
            MongoManager.instance = new MongoManager();
        }

        return MongoManager.instance;
    };
    return MongoManager;
})();

module.exports = MongoManager;
//# sourceMappingURL=MongoManager.js.map

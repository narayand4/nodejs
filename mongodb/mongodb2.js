//Remove any Data in collection.

// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/nodejsdb", function(err, db) {
  if(err) { return console.dir(err); }

  var collection = db.collection('testData');
  var docs = [{mykey:1}, {mykey:2}, {mykey:3}];

  collection.insert(docs, {w:1}, function(err, result) {

    collection.remove({mykey:1}, function(err, result) {});

    collection.remove({mykey:2}, {w:1}, function(err, result) {});

    //collection.remove();
  });
});
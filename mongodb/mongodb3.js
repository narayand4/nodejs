//Fetch Data from collection.

// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/nodejsdb", function(err, db) {
  if(err) { return console.dir(err); }

  var collection = db.collection('testData');
  var docs = [{mykey:1}, {mykey:2}, {mykey:3}];

  collection.insert(docs, {w:1}, function(err, result) {

    collection.find().toArray(function(err, items) {});

    var stream = collection.find({mykey:{$ne:2}}).stream();
    stream.on("data", function(item) {});
    stream.on("end", function() {});

    collection.findOne({mykey:1}, function(err, item) {
      console.log(item);
    });

  });
});
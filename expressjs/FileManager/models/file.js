"use strict";

var fs = require('fs');
var async = require('async');
var ROOT = __dirname + '/../files';
var path = require('path');

function File(userId, name) {
  this.userId = userId;
  this.name = name;
  this.path = this._getPath();
}

File.prototype._getPath = function() {
  return path.resolve(File.getUserPath(this.userId) + '/' + this.name);
};

File.prototype.isValidFileName = function() {
  return /[a-z0-9_]/i.test(this.name);
};

File.prototype.exists = function(callback) {
  if (!this.isValidFileName()) {
    // keep the function async by not calling the function instantly (sync)
    return process.nextTick(function() { callback(null, false) });
  }

  fs.exists(this.path, callback);
};

File.prototype.delete = function(callback) {
  this.exists((function(exists) {
    if (!exists) { return callback(); }
    fs.unlink(this.path, callback);
  }).bind(this));
};

File.prototype.save = function(tempPath, callback) {
  if (!this.isValidFileName()) {
    return process.nextTick(function() {
      callback(null, new Error('Invalid filename'))
    });
  }

  var readStream = fs.createReadStream(tempPath);
  var writeStream = fs.createWriteStream(this.path);
  // if an error occurs invoke the callback with an error param
  readStream.on('error', callback);
  writeStream.on('error', callback);

  writeStream.on('close', callback);
  readStream.pipe(writeStream);
};

File.prototype.getStats = function(callback) {
  fs.stat(this.path, callback);
};

File.getUserPath = function(userId) {
  return ROOT + '/' + userId;
};

// create a folder if it doesn't exist already
File.createFolder = function(userId, callback) {
  var userPath = File.getUserPath(userId);

  fs.exists(userPath, function(exists) {
    if (!exists) {
      fs.mkdir(userPath, callback);
    }
  });
};

File.getByUserId = function(userId, callback) {
  var getFiles = function(files) {
    if (!files) { return callback(null, []); }

    // get the stats for every file
    async.map(files, function(name, done) {
      var file = new File(userId, name);
      file.getStats(function(err, stats) {
        if (err) { return done(err); }

        done(null, {
          name: name,
          stats: stats
        });
      });
    }, callback);
  };

  fs.readdir(File.getUserPath(userId), function(err, files) {
    if (err && err.code === 'ENOENT') {
      File.createFolder(userId, function(err) {
        if (err) { return callback(err); }

        getFiles(files);
      });
    } else if (!err) {
      getFiles(files);
    } else {
      return callback(err);
    }
  });
};

module.exports = File;
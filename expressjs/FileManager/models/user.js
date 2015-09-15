"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pass = require('pwd');

var validateUser = function(username) {
  return !!(username && /^[a-z][a-z0-9_-]{3,15}$/i.test(username));
};
var validatePassword = function(pass) {
  return !!(pass && pass.length > 5);
};

var User = new Schema({
  username: {
    type: String,
    validate: validateUser,
    unique: true
  },
  salt: String,
  hash: String
}, {
  safe: true
});

// we cannot use a virtual password setter since this function is async
User.methods.setPassword = function(password, callback) {
  pass.hash(password, (function(err, salt, hash) {
    if (err) { return callback(err); }

    this.hash = hash;
    this.salt = salt;

    callback();
  }).bind(this));
};

// validate the schema properties && other non-schema properties (password)
User.methods.validateAll = function(props, callback) {
  this.validate((function(err) {
    if (err) { return callback(err); }

    if (!validatePassword(props.password)) {
      return callback(new Error('ValidationError: invalid password'));
    }

    return callback();
  }).bind(this));
};

User.methods.saveWithPassword = function(password, callback) {
  this.validateAll({ password: password }, (function(err) {
    if (err) { return callback(err); }

    this.setPassword(password, (function(err) {
      if (err) { return callback(err); }

      this.save(callback);
    }).bind(this));
  }).bind(this));
};

User.statics.authenticate = function(username, password, callback) {
  // avoid making a call to the database for an invalid username/password
  if (!validateUser(username) || !validatePassword(password)) {
    // keep this function async in all situations
    return process.nextTick(function() { callback(null, false) });
  }

  this.findOne({ username: username }, function(err, user) {
    if (err) { return callback(err); }
    // no such user in the database
    if (!user) { return callback(null, false); }

    pass.hash(password, user.salt, function(err, hash) {
      if (err) { return callback(err); }

      // if the auth was successful return the user details
      return (user.hash === hash) ? callback(null, user) : callback(null, false);
    });
  });
};

module.exports = mongoose.model('User', User);
var mongoose = require('mongoose');

// simple but incomplete email regexp:
var emailRegexp = /.+\@.+\..+/;

var UserSchema = new mongoose.Schema({
	username: {type: String, unique: true},
	name: String,
	password: String,
	email: {
		type: String,
		required: true,
		match: emailRegexp
	}
});
module.exports = UserSchema;
var async = require('async'),
request = require('request');
function done(err, res, body) {
	if (err) {
		throw err;
	}
	console.log("3^4 = %d", body);
}
async.waterfall([
	function(next) {
		request.post({uri: 'http://localhost:4000', body: "3"}, next)
	},
	function(res, body, next) {
		request.post({uri: 'http://localhost:4000', body: body}, next);
	}
], done);

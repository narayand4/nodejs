var async = require('async'),
request = require('request');
function done(err, results) {
	if (err) {
		throw err;
	}
	console.log('results: %j', results);
}
async.series([
	function(next) {
		request.post({uri: 'http://localhost:4000', body: '4'},
			function(err, res, body) {
				next(err, body && JSON.parse(body));
			}
		);
	},
	function(next) {
		request.post({uri: 'http://localhost:4000', body: '5'},
			function(err, res, body) {
				next(err, body && JSON.parse(body));
			}
		);
	}
], done);

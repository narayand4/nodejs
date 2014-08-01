var async = require('async'),
request = require('request');
var collection = [1, 2, 3, 4];
function done(err, results) {
	if (err) {
		throw err;
	}
	console.log('done! results: %j', results);
}
function iterator(value, callback) {
	request.post({
		uri: 'http://localhost:4002',
		body: JSON.stringify(value)
	},
	function(err, res, body) {
		callback(err, body && JSON.parse(body));
	});
}
async.map(collection, iterator, done);

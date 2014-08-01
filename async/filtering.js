var async = require('async'),
request = require('request');
var collection = [1, 2, 3, 4, 5];
function done(results) {
	console.log('These are the elements of %j whose ' +
	'square value is greater than 10: %j', collection, results);
}
function test(value) {
	return value > 10;
}
function filter(item, callback) {
	request.post({
		uri: 'http://localhost:4002',
		body: JSON.stringify(item)
	},
	function(err, res, body) {
		if (err) {
			throw err;
		}
		callback(body && test(JSON.parse(body)));
	});
}
async.filter(collection, filter, done);
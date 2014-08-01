var async = require('async'),
request = require('request');
var collection = [1, 2, 3, 4];
function done(err, result) {
	if (err) {
		throw err;
	}
	console.log('The sum of the squares of %j is %d', collection, result);
}
function iterator(memo, item, callback) {
	request.post({
		uri: 'http://localhost:4002',
		body: JSON.stringify(item)
	},
	function(err, res, body) {
		callback(err, body && (memo + JSON.parse(body)));
	});
}
async.reduce(collection, 0, iterator, done);

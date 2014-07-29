//start the server using this command
//$ node server.js
//then run this command
//$ node redirect.js
var request = require('request');
var inspect = require('util').inspect;
request(
	'http://localhost:4001/redirect',
	function(err, res, body) {
		if (err) { throw err; }
		console.log(inspect({
		err: err,
		res: {
			statusCode: res.statusCode
		},
		body: JSON.parse(body)
	}))
});

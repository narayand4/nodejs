//start the server using this command
//$ node server.js
//then run this command
//$ node client.js
var request = require('request');
var inspect = require('util').inspect;
request(
	'http://localhost:4001/print/body',
	function(err, res, body) {
		if (err) { throw err; }
			console.log(inspect({
			err: err,
			requestes: {
				statusCode: res.statusCode
			},
			body: JSON.parse(body)
		}))
	}
);

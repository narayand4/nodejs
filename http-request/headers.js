//start the server using this command
//$ node server.js
//then run this command
//$ node headers.js
var request = require('request');
var inspect = require('util').inspect;
var options = {
	url: 'http://localhost:4001/abc/def',
	method: 'PUT',
	headers: {
		'X-My-Header': 'value'
	}
};
request(options, function(err, res, body) {
	if (err) { throw err; }
	console.log(inspect({
		err: err,
		res: {
			statusCode: res.statusCode,
			headers: res.headers
		},
		body: JSON.parse(body)
	}))
});

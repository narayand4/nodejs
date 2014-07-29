//start the server using this command
//$ node server.js
//then run this command
//$ node form.js
var request = require('request');
var inspect = require('util').inspect;
body = {
	a: 1,
	b: 2
};
var options = {
	url: 'http://localhost:4001/print/body',
	form: body
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

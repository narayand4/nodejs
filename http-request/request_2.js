var http = require('http');
var options = {
	host: "www.google.com",
	port: 80,
	path: "/upload",
	method: "POST"
};
var request = http.request(options, function(response) {
	console.log('STATUS:', response.statusCode);
	console.log('HEADERS:', response.headers);
	response.setEncoding('utf8');
	response.on('data', function (chunk) {
		console.log('BODY:', chunk);
	});
});
request.write('This is a piece of data.\n');
request.write('This is another piece of data.\n');
request.end();

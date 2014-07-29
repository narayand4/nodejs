var http = require('http');
var fs = require('fs');
var options = {
	host: "www.google.com",
	port: 80,
	path: "/",
	method: "GET"
};
var file = fs.createWriteStream('test.txt');
http.request(options, function(res) {
	res.pipe(file);
}).end();

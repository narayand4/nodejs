var http = require('http');
var makeRequest = function(message) {
	var options = {
		host:"www.drsohanrajtater.com",
		port:80,
		path:'/images',
		method:'POST'
	}

	var request = http.request(options, function(response){
		response.on('data', function(data){
			console.log(data);
		});
	});

	request.write(message);
	request.end();
}

exports = makeRequest;
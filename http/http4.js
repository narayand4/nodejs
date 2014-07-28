var http = require('http');
var options = {
	host:"www.drsohanrajtater.com",
	port:80,
	path:'/images',
	method:'POST'
};

var req = http.request(options,function(res){
	console.log('Status : '+res.statusCode);
	console.log('Headers: '+JSON.stringify(res.headers));
	res.setEncoding('utf8');
	res.on('data',function(chunk){
		console.log('Body: '+chunk);
	});
});

req.write('data\n');
req.write('data\n');
req.end();
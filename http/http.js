var http = require('http');
var server = http.createServer();
server.on('request',function(req,res){
	res.writeHead(200,{'Content-Type' : 'text-plain'});
	res.write('Hello world');
	res.end();
});
server.listen(4000);
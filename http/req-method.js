require('http').createServer(function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end(req.method);
}).listen(4000);

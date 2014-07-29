require('http').createServer(function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end(req.url);
}).listen(4000);

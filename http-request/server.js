require('http').createServer(function(req, res) {
	function printBack() {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(JSON.stringify({
			url: req.url,
			method: req.method,
			headers: req.headers
		}));
	}
	switch (req.url) {
		case'/redirect':
			res.writeHead(301, {"Location": '/'});
			res.end();
		break;
		case'/print/body':
			req.setEncoding('utf8');
			var body = '';
			req.on('data', function(d) {
				body += d;
			});
			req.on('end', function() {
				res.end(JSON.stringify(body));
			});
		break;
		default:
			printBack();
		break;
	}
}).listen(4001);

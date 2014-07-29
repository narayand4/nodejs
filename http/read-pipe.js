var fs = require('fs');
require('http').createServer(function(req, res) {
	res.writeHead(200, {'Content-Type': 'video/mp4'});
	var rs = fs.createReadStream('cute_baby.mp4');
	rs.pipe(res);
}).listen(4000);

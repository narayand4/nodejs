var fs = require('fs');
require('http').createServer( function(req, res) {
	var rs = fs.createReadStream('sample_file.log');
	rs.pipe(res, { end: false });
	rs.on('end', function() {
		res.write("And that's all, folks!");
		res.end();
	});

	/*rs.on('data', function(data) {
		if (!res.write(data)) {
			rs.pause();
		}
	});
	res.on('drain', function() {
		rs.resume();
	});
	rs.on('end', function() {
		res.end();
	});*/
}).listen(3000);
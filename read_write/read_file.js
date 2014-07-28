var fs = require('fs');
var path = 'sample_file.log';
fs.open(path, 'r', function(err, fd) {
	fs.createReadStream(null, {fd: fd, encoding: 'utf8'});
	fs.on('data', console.log);
	//console.log(fd);
});

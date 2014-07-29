require('net').createServer(function(socket) {
var rs = require('fs').createReadStream('hello.txt');
	rs.pipe(socket);
}).listen(4002);

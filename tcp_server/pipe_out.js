var ws = require('fs').createWriteStream('mysocketdump.txt');
require('net').createServer(function(socket) {
	socket.pipe(ws);
}).listen(4002);

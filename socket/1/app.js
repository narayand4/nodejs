var io = require('socket.io').listen(4000);
	io.sockets.on('connection', function (socket) {
	socket.on('my_event', function(content) {
		console.log(content);
	});
});
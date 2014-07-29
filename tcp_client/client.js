//run this command in terminal from tcp_server
//$ node server_1.js 
//Now run this command in another terminal
//$ node client.js
//both client and server communicate with each other.

var net = require('net');
var port 			= 4001;
var quitting 		= false;
var conn;
var retryTimeout 	= 3000; // 3 seconds
var retriedTimes 	= 0;
var maxRetries 		= 10;

process.stdin.resume();
process.stdin.on('data', function(data) {
	if (data.toString().trim().toLowerCase() === 'quit') {
		quitting = true;
		console.log('quitting...');
		conn.end();
		process.stdin.pause();
	} else {
		conn.write(data);
	}
});

(function connect() {
	function reconnect() {
		if (retriedTimes >= maxRetries) {
			throw new Error('Max retries have been exceeded, I give up.');
		}
		retriedTimes += 1;
		setTimeout(connect, retryTimeout);
	}

	conn = net.createConnection(port);
	
	conn.on('connect', function() {
		retriedTimes = 0;
		console.log('connected to server');
	});

	conn.on('error', function(err) {
		console.log('Error in connection:', err);
	});

	conn.on('close', function() {
		if (! quitting) {
			console.log('connection got closed, will try to reconnect');
			reconnect();
		}
	});

	conn.pipe(process.stdout, {end: false});
}());


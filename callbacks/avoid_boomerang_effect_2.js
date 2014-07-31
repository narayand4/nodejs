var fs = require('fs');
function append_some_a_to_b(callback) {
	var aFd, bFd,
	buffer = new Buffer(10);
	function open_a() {
		fs.open(__dirname + '/a.txt', 'r', read_from_a);
	}
	function read_from_a(err, fd) {
		if (err) {
			return callback(err);
		}
		aFd = fd;
		fs.read(aFd, buffer, 0, buffer.length, 0, close_a);
	}
	function close_a(err) {
		if (err) {
			return callback(err);
		}
		fs.close(aFd, open_b);
	}
	function open_b(err) {
		if (err) {
			return callback(err);
		}
		fs.open(__dirname + '/b.txt', 'a', stat_b);
	}
	function stat_b(err, fd) {
		if (err) {
			return callback(err);
		}
		bFd = fd;
		fs.fstat(bFd, write_b);
	}
	function write_b(err, bStats) {
		if (err) {
			return callback(err);
		}
		fs.write(bFd, buffer, 0, buffer.length, bStats.size, close_b);
	}
	function close_b(err) {
		if (err) {
			return callback(err);
		}
		fs.close(bFd, callback);
	}
	open_a();
}

console.log('starting...');
append_some_a_to_b(function(err) {
	if (err) {
		throw err;
	}
	console.log('done');
});
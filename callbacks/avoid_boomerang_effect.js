var fs = require('fs');
function append_some_a_to_b(callback) {
	fs.open(__dirname + '/a.txt', 'r', function(err, aFd) {
		if (err) {
			return callback(err);
		}

		var buffer = new Buffer(100);
		fs.read(aFd, buffer, 0, buffer.length, 0, function(err) {
			if (err) {
				return callback(err);
			}
			fs.close(aFd, function(err) {
				if (err) {
					return callback(err);
				}
				fs.open(__dirname + '/b.txt', 'a', function(err, bFd) {
					if (err) {
						return callback(err);
					}
					fs.fstat(bFd, function(err, bStats) {
						if (err) {
							return callback(err);
						}
						fs.write(bFd, buffer, 0, buffer.length, bStats.size, function(err) {
							if (err) {
								return callback(err);
							}
							fs.close(bFd, callback);
						});
					});
				});
			});
		});
	});
}

console.log('starting...');
append_some_a_to_b(function(err) {
	if (err) {
		throw err;
	}
	console.log('done');
});

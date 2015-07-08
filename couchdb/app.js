var url 			= require('url');
var formidable 		= require('formidable');
var BufferedStream 	= require('bufferedstream');
var nano 			= require('nano');
var couchdb 		= nano('http://127.0.0.1:5984/');

var couchMapReduce = function (doc) {
	emit([doc.room, doc.when], doc);
};

couchdb.db.create('chat', function(err) {
	if (err && err.status_code !== 412) {
		throw err;
	}
	couchdb.db.create('users', function(err) {
		if (err && err.status_code !== 412) {
			throw err;
		}
		var designDoc = {
			language: "javascript",
			views: {
				by_room: {
					map: couchMapReduce.toString()
				}
			}
		};
		
		var chatDB = couchdb.use('chat');
		
		(function insertOrUpdateDesignDoc() {
			chatDB.insert(designDoc, '_design/designdoc', function(err) {
				if (err) {
					if (err.status_code === 409) {
						chatDB.get('_design/designdoc', function(err, ddoc) {
							if (err) { return console.error(err); }
							designDoc._rev = ddoc._rev;
							insertOrUpdateDesignDoc();
						});
						return;
					} else {
						return console.error(err);
					}
				}
				startServer();
			});
		}());
	});
});

function startServer() {
	console.log('starting server');
	var chatDB = couchdb.use('chat');
	var userDB = couchdb.use('users');
	var httpd = require('http').createServer(handler);
	var io = require('socket.io').listen(httpd);
	var fs = require('fs');
	httpd.listen(4000);
	
	function handler(req, res) {
		var username;
		if (req.method === 'POST' && req.url.indexOf('/avatar') === 0) {
			var currentUserDocRev;
			console.log('got avatar');
			var bufferedRequest = new BufferedStream();
			bufferedRequest.headers = req.headers;
			bufferedRequest.pause();
			req.pipe(bufferedRequest);
			// parse username
			console.log(url.parse(req.url).query);
			username = url.parse(req.url, true).query.username;
				userDB.insert({username: username}, username, function(err, user) {
				if (err) {
					if (err.status_code === 409) {
						userDB.get(username, function(err, user) {
							if (err) {
								console.error(err);
								res.writeHead(500);
								return res.end(JSON.stringify(err));
							}
							currentUserDocRev = user._rev;
							bufferedRequest.resume();
						});
						return;
					} else {
						res.writeHead(500);
						return res.end(JSON.stringify(err));
					}
				}
				console.log('username inserted, rev = ', user.rev);
				currentUserDocRev = user.rev;
				console.log('currentUserDocRev:', currentUserDocRev);
				bufferedRequest.resume();
			});
			// handle avatar upload
			var form = new formidable.IncomingForm();
			form.encoding = 'utf8';
			form.parse(bufferedRequest);
			
			form.onPart = function(part) {
				if (part.name !== 'avatar') {
					return;
				}
				var attachment = userDB.attachment.insert(
					username, 'avatar', null, part.mime, {rev: currentUserDocRev}
				);
				part.pipe(attachment);
				attachment.on('error', function(err) {
					console.error(err);
					res.writeHead(500);
					return res.end(JSON.stringify(err));
				});
				attachment.on('end', function() {
					res.end();
				});
			};
		} else if (req.url.indexOf('/avatar') === 0){
			// serve the avatar
			username = url.parse(req.url, true).query.username;
			userDB.attachment.get(username, 'avatar').pipe(res);
		} else {
			// serve the index page
			fs.readFile(__dirname + '/index.html',
				function(err, data) {
					if (err) {
						res.writeHead(500);
						return res.end('Error loading index.html');
					}
					res.writeHead(200);
					res.end(data);
				}
			);
		}
	}

	function sendBackLog(socket, room) {
		var getOptions = {
			start_key: JSON.stringify([room, 9999999999999]),
			end_key: JSON.stringify([room, 0]),
			limit: 10,
			descending: true
		};
		
		chatDB.get('_design/designdoc/_view/by_room', getOptions,
			function(err, results) {
				var messages = results.rows.reverse().map(function(res) {
					return res.value;
				});
				socket.emit('backlog', messages);
			}
		);
	}

	var chat = io.of('/chat');
	chat.on('connection', function (socket) {
		socket.on('clientMessage', function(content) {
			socket.get('username', function(err, username) {
				if (! username) {
					username = socket.id;
				}
				socket.get('room', function(err, room) {
					if (err) { throw err; }
					var broadcast = socket.broadcast;
					var message = content;
					if (room) {
						broadcast.to(room);
					}
					var messageDoc = {
						when: Date.now(),
						from: username,
						room: room,
						message: content
					};
					socket.emit('serverMessage', messageDoc);
					chatDB.insert(messageDoc, function(err) {
						if (err) { console.error(err); }
					});
					broadcast.emit('serverMessage', messageDoc);
				});
			});
		});

		socket.on('login', function(username) {
			socket.set('username', username, function(err) {
				if (err) { throw err; }
					var message = {
					from: username,
					message: 'Logged in',
					when: Date.now()
				};
				socket.emit('serverMessage', message);
				socket.broadcast.emit('serverMessage', message);
				sendBackLog(socket, null);
			});
		});

		socket.on('disconnect', function() {
			socket.get('username', function(err, username) {
				if (! username) {
					username = socket.id;
				}
				var message = {
					from: username,
					message: 'disconnected',
					when: Date.now()
				};
				socket.broadcast.emit('serverMessage', message);
			});
		});

		socket.on('join', function(room) {
			socket.get('room', function(err, oldRoom) {
				if (err) { throw err; }
				socket.set('room', room, function(err) {
					if (err) { throw err; }
						socket.join(room);
						if (oldRoom) {
							socket.leave(oldRoom);
						}
						socket.get('username', function(err, username) {
						if (! username) {
							username = socket.id;
						}
						var message = {
							from: username,
							message: 'joined room ' + room + '. Fetching backlog...',
							when: Date.now()
						};
						socket.emit('serverMessage', message);
						socket.broadcast.to(room).emit('serverMessage', message);
					});
					sendBackLog(socket, room);
				});
			});
		});

		socket.emit('login');
	});
}
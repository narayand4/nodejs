function connectionListener(){
	console.log('Server connected');
	server.removeListener('connection',connectionListener);
}

server.on('connection',connectionListener);
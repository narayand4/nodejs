//Create private key using these commands.
//$ openssl genrsa -out server_key.pem 1024
//$ openssl req -new -key server_key.pem -out server_csr.pem
//$ openssl x509 -req -in server_csr.pem -signkey server_key.pem \-out server_cert.pem

var tls = require('tls');
var fs = require('fs');
var port = 4001;
var clients = [];
var options = {
	key: fs.readFileSync('server_key.pem'),
	cert: fs.readFileSync('server_cert.pem'),
	//requestCert: true,
	rejectUnauthorized: true,
	ca: fs.readFileSync('fake_ca.pem'),
	requestCert: true
};
function distribute(from, data) {
	var socket = from.socket;
	clients.forEach(function(client) {
		if (client !== from) {
			client.write(socket.remoteAddress + ':' + socket.remotePort +' said: ' + data);
		}
	});
}
var server = tls.createServer(options, function(client) {
	console.log('client.authorized:', client.authorized);

	clients.push(client);
	client.on('data', function(data) {
		distribute(client, data);
	});
	client.on('close', function() {
		console.log('closed connection');
		clients.splice(clients.indexOf(client), 1);
	});
});
server.listen(port, function() {
	console.log('listening on port', server.address().port);
});

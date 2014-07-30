//Create public key using these commands.
//$ openssl genrsa -out client_key.pem 1024
//$ openssl req -new -key client_key.pem -out client_csr.pem
//$ openssl x509 -req -in client_csr.pem -signkey client_key.pem -out client_cert.pem

var tls = require('tls');
var fs = require('fs');
var port = 4001;
var host = '127.1.0.0';
var options = {
	key: fs.readFileSync('client_key.pem'),
	cert: fs.readFileSync('client_cert.pem'),
	rejectUnauthorized: false,
};
process.stdin.resume();
var client = tls.connect(port, host, options, function() {
	console.log('connected');
	client.write('Hey, hello!');

	process.stdin.pipe(client, {end: false});
	client.pipe(process.stdout);
});

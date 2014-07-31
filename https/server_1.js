var fs = require('fs');
var https = require('https');
var options = {
	host: 'google.com',
	method: 'GET',
	path: '/'
};
var req = https.request(options, function(res) {
	console.log('res.socket.authorized:', res.socket.authorized);
	console.log('peer certificate:');
	console.log(res.socket.getPeerCertificate());
});
req.end();

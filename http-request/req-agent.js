var http = require('http');
var agentOptions = {
	maxSockets: 10
};
var agent = new Agent(options);
// Use our agent for this request:
var requestOptions = {
	host: 'www.google.com',
	port: 80,
	agent: agent
};
var req = http.request(requestOptions);
req.end();

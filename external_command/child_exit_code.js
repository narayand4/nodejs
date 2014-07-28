var spawn = require('child_process').spawn;
// Spawn the child with a "ls does_not_exist.txt" command
var child = spawn('ls', ['does_not_exist.txt']);
// When the child process exits:
child.on('exit', function(code) {
	console.log('child process terminated with code ' + code);
});

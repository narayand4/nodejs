var exec = require('child_process').exec;
exec('node environment_number_child.js', {env: {number: 123}}, function(err, stdout, stderr) {
	if (err) { throw err; }
	console.log('stdout:\n', stdout);
	console.log('stderr:\n', stderr);
});

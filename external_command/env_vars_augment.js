var env = process.env,
varName,
envCopy = {},
exec = require('child_process').exec;
// Copy process.env into envCopy
for (varName in env) {
	envCopy[varName] = env[varName];
}
// Assign some custom variables
envCopy['CUSTOM ENV VAR'] 	= 'Durgesh';
envCopy['CUSTOM ENV VAR 2'] = 'Narayan';
// Execute some command with process.env and my custom variables
exec('ls -la', { env: envCopy }, function(err, stdout, stderr) {
	if (err) { throw err; }
	console.log('stdout:', stdout);
	console.log('stderr:', stderr);
});

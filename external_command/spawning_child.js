// Import the spawn function defined on child_process module
var spawn = require('child_process').spawn;
// Launch a child process with a "tail -f /var/log/system.log" command
var child = spawn('tail', ['-f', '/var/log/system.log']);
/*
Here you spawn a child process to run a tail command, passing in arguments -f and /var/log/
system.log. This tail command will monitor the fi le in /var/log/system.log — if it exists —
and output every new data appended to it into the stdout stream. The spawn function call returns
a ChildProcess object, which is a handler object that encapsulates access to the real process.
Here you assign this new descriptor to the variable named child.
*/

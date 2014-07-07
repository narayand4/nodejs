var fs = require('fs');
fs.readFile('/var/www/index.html', function(err, fileContent) {
if (err) {
throw err;
}
console.log('file content', fileContent.toString());
});


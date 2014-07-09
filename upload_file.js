var fs = require('fs');
var http = require('http');
http.createServer(function(request, response) {
	var newFile = fs.createWriteStream("readme_copy.md");
	request.pipe(newFile);
	request.on('end', function() {
		fs.open('write.log','a',function(err,fd){
			var writeBuffer = new Buffer('Write the string'),
			bufferOffset = 0,
			bufferLength = writeBuffer.length,
			filePosition = null;

			fs.write(
				fd,
				writeBuffer,
				bufferOffset,
				bufferLength,
				filePosition,
				function(err,written){
					if(err) throw err;
					console.log('wrote '+written+ ' bytes');
				}
			);
		});
		response.end('uploaded!');
	});
}).listen(8090);

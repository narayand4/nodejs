var fs = require('fs');
fs.open('/var/log/auth.log','r',function(err,fd){
	if(err) throw err;
	var readBuffer = new Buffer(1024),
	bufferOffset = 0,
	bufferLength = readBuffer.length,
	filePosition = 100;
	fs.read(fd,readBuffer,bufferOffset,bufferLength,filePosition,function(err,readBytes){
		if(err) throw error;
		console.log('just read '+readBytes+' bytes');
		if(readBytes>0){
			console.log(readBuffer.slice(0,readBytes));
		}
	});
});

var util = require('util'),
EventEmitter = require('events').EventEmitter;
var Ticker = function() {
	var self = this;
	setInterval(function() {
		self.emit('tick');
	}, 1000);
};
util.inherits(Ticker, EventEmitter);

var ticker = new Ticker();
ticker.on("tick", function() {
console.log("tick");
});

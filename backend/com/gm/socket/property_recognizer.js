var util				= require('util'),
	CommandRecognizer 	= require('./command_recognizer');

function PropertyRecognizer(options) {
	PropertyRecognizer.super_.call(this, options);

	this.property 	= options.property;
}

util.inherits(PropertyRecognizer, CommandRecognizer);

PropertyRecognizer.prototype.onMessage = function(msg) {
	if(msg.hasOwnProperty(this.property) && msg[this.property] == this.value) {
		this.onRecognized.call(this, msg);
	}
}

module.exports = PropertyRecognizer;


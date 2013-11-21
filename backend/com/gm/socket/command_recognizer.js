function CommandRecognizer(options) {
	this.options = options;

	if(this.options.socket === undefined)
		throw new Error('CommandRecognizer requires socket');

	if(this.options.property === undefined)
		throw new Error('CommandRecognizer requires property');

	this.socket 	= options.socket;
	this.property	= options.property;

	this.onRecognized 	= this.options.onRecognized.bind(this) 	|| this.onRecognized;

	this.socket.on('message', this.onMessage.bind(this));
}

CommandRecognizer.prototype.onRecognized = function(oldValue, newValue) {
	// Stub
};

CommandRecognizer.prototype.onMessage = function(msg) {
	if(msg.hasOwnProperty(this.property)) {
		this.onRecognized.call(this, msg[this.property]);
	}
}

module.exports = CommandRecognizer;


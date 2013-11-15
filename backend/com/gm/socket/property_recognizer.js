function PropertyRecognizer(options) {
	this.options = options;

	if(this.options.value === undefined)
		throw new Error('PropertyRecognizer requires value');

	if(this.options.socket === undefined)
		throw new Error('PropertyRecognizer requires socket');

	if(this.options.property === undefined)
		throw new Error('PropertyRecognizer requires property');

	this.socket 	= options.socket;
	this.value 		= options.value;
	this.property = options.property;

	this.onRecognized 	= this.options.onRecognized.bind(this) 	|| this.onRecognized;

	this.socket.on('message', this.onMessage.bind(this));
}

PropertyRecognizer.prototype.onRecognized = function(oldValue, newValue) {
	// Stub
};

PropertyRecognizer.prototype.onMessage = function(msg) {
	if(msg.hasOwnProperty(this.property) && msg[this.property] == this.value) {
		this.onRecognized.call(this, msg);
	}
}

module.exports = PropertyRecognizer;


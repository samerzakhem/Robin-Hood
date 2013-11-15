var faye 		= require('faye'),
		events 	= require('events'),
		util 		= require('util');

function Relay(options) {
	Relay.super_.call(this);

	this.options 		= options || {};

	if(this.options.from === undefined)
		throw new Error('Relay requires from');

	if(this.options.to === undefined)
		throw new Error('Relay requires to');

	// Set some default options
	this.interval 	= options.interval 	|| 0;
	this.translate 	= options.translate || this.translate;
	this.fitler 		= options.filter 		|| this.filter;

	// Set some internal convenience variables
	this.from 			= options.from;
	this.to 				= options.to;

	this._lastMessage 	= undefined;
	this._interval 			= undefined;

	// Subscribe to to the messages from the "from" source
	this.from.on('message', 	this.onMessage.bind(this));

	// If there's to be an interval, configure it
	if(this.interval)
		this._initIntervalSend();
}

util.inherits(Relay, events.EventEmitter);

Relay.prototype._initIntervalSend = function() {
	clearInterval(this._interval);
	this._interval = setInterval(this._sendLastMessage.bind(this), this.interval * 1000)
};

Relay.prototype._sendLastMessage = function() {
	if(this._lastMessage) {
		this.send( this._lastMessage );
		this._lastMessage = undefined;
	}
};

Relay.prototype.onMessage = function(msg) {
	if(this.filter(msg)) {
		if(this.interval) {
			this._lastMessage = msg;
		} else this.send(msg);
	}
};

Relay.prototype.filter = function(msg) {
	return true;
};

Relay.prototype.translate = function(msg) {
	return msg;
};

Relay.prototype.send = function(msg) {
	this.to.send( this.translate(msg) );
};

module.exports = Relay;
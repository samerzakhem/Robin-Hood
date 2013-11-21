var faye 	= require('faye'),
	events 	= require('events'),
	util 	= require('util');

function FayeChannel(options) {
	FayeChannel.super_.call(this);

	this.options 		= options || {};

	if(this.options.url === undefined)
		throw new Error('FayeChannel requires url');

	if(this.options.channel === undefined)
		throw new Error('FayeChannel requires channel');

	// Option defaults
	this.onMessage 			= this.options.onMessage 	|| this.onMessage;
	this.onTimer 			= this.options.onTimer 		|| this.onTimer;
	this.buffer 			= this.options.buffer 		|| 0;

	// Private 
	this._lastMessage 		= undefined;
	this._interval 			= undefined;

	if(this.buffer)
		this._interval = setInterval(this._sendBuffer.bind(this), this.buffer * 1000);

	this._initClient();
}

util.inherits(FayeChannel, events.EventEmitter);

FayeChannel.prototype._initClient = function() {
	this._client = new faye.Client(this.options.url);
	this._client.subscribe(this.options.channel, this._onMessage.bind(this));
};

FayeChannel.prototype._onMessage = function(msg) {
	this.emit('message', msg);
	this.onMessage.call(this, msg);
	this._lastMessage = msg;
};

FayeChannel.prototype._sendBuffer = function() {
	if(this._lastMessage) {
		this.emit('timer', this._lastMessage);
		this.onTimer.call(this, this._lastMessage);
		this._lastMessage = undefined;
	}
};

FayeChannel.prototype.onMessage = function(msg) {
	// Stub
};

FayeChannel.prototype.onTimer = function(msg) {
	// Stub
};

FayeChannel.prototype.send = function(msg) {
	this._client.publish(this.options.channel, msg);
};


module.exports = FayeChannel;
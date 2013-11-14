var faye 		= require('faye'),
		events 	= require('events'),
		util 		= require('util');

function FayeChannel(options) {
	FayeChannel.super_.call(this);

	this.options 		= options || {};

	if(this.options.url === undefined)
		throw new Error('FayeChannel requires url');

	if(this.options.channel === undefined)
		throw new Error('FayeChannel requires channel');

	// Option defaults
	this.onMessage 	= this.options.onMessage || this.onMessage;

	this._initClient();
}

util.inherits(FayeChannel, events.EventEmitter);

FayeChannel.prototype._initClient = function() {
	this._client = new faye.Client(this.options.url);
	this._client.subscribe(this.options.channel, this._onMessage.bind(this));
};

FayeChannel.prototype._onMessage = function(message) {
	this.emit('message', message);
	this.onMessage.call(this, message);
};

FayeChannel.prototype.onMessage = function(msg) {
	// Stub
};

FayeChannel.prototype.send = function(msg) {
	this._client.publish(msg);
};


module.exports = FayeChannel;
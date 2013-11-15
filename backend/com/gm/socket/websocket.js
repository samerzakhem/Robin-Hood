var	websocket = require('faye-websocket'),
		events 		= require('events'),
		util 			= require('util');

function WebSocket(options) {
	WebSocket.super_.call(this);;

	this.options 		= options;

	if(this.options.url === undefined)
		throw new Error('WebSocket expects url');

	// Set some internal vars
	this._reconnectInterval 		= undefined;
	this._connected 						= false;

	// Initialize the client
	this._initClient();

	// Some defaults for message events
	this.onOpen 		= this.options.onOpen 		|| function() {};
	this.onClose 		= this.options.onClose 		|| function() {};
}

util.inherits(WebSocket, events.EventEmitter);

//// [ INITIALIZERS ] /////////////////////////////////////////////////////////

WebSocket.prototype._initClient = function() {
	// Create the client
	this.client	= new websocket.Client( this.options.url );

	// Bind some listeners
	this.client.on('open', 			this._onOpen.bind(this));
	this.client.on('close', 		this._onClose.bind(this));
	this.client.on('message', 	this._onMessage.bind(this));
};

WebSocket.prototype._onOpen = function(e) {
	clearTimeout(this._reconnectInterval);
	this._connected = true;
	this.onOpen.call(this, e);
};

WebSocket.prototype._onClose = function(e) {
	this._reconnectInterval = setTimeout(this._initClient.bind(this), 5000);
	this._connected = false;
	this.onClose.call(this, e);
};

WebSocket.prototype._onMessage = function(e) {
	var value = e.data;

	try {
		value = JSON.parse(value);
	} catch(e) {
		// Guess it wasn't json...
	} finally { this.emit('message', value); }
};

WebSocket.prototype.isConnected = function() {
	return this._connected;
};

WebSocket.prototype.send = function(msg) {
	if(this.isConnected())
		this.client.send( (msg instanceof Object) ? JSON.stringify(msg) : msg );
};

module.exports = WebSocket;
var fayeChannel 	= require('./faye_channel'),
		websocket 		= require('faye-websocket'),
		util 					= require('util');

function PropertyWatcher(options) {
	PropertyWatcher.super_.call(this, options);

	if(this.options.property === undefined)
		throw new Error('PropertyWatcher requires property');

	this.property 	= options.property;
	this.value 			= undefined;

	this.onChange 	= this.options.onChange.bind(this) 	|| this.onChange;
}

util.inherits(PropertyWatcher, fayeChannel);

PropertyWatcher.prototype.onChange = function(oldValue, newValue) {
	// Stub
};

PropertyWatcher.prototype.onMessage = function(msg) {
	if(msg.hasOwnProperty(this.property) && msg[this.property] != this.value) {
		this.onChange.apply(this, [this.value, this.value = msg[this.property]]);
	}
}

module.exports = PropertyWatcher;


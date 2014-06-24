var exec 		= require('child_process').exec,
		socket  = require('../com/gm/socket'),
		util		= require('util');

function StatusMonitor(options) {
	StatusMonitor.super_.call(this, options);

	this.values = {
		locked: 				undefined,
		ignition: 			undefined,
		charging: 			undefined,
		batteryLevel: 	undefined,
		traumaLevel: 		undefined,
		handsfree: 			undefined,
		user: 					undefined,
		seatbelt: 			undefined
	};

	this._dirty = false;
}

// util.inherits(StatusMonitor, socket.Responder);
util.inherits(StatusMonitor, socket.FayeChannel);

StatusMonitor.prototype.onMessage = function(message) {
	
	// Loop over every key in the status message
	for(key in message) {
		// If we have this key, and it's different
		// if(this.values.hasOwnProperty(key) &&  this.values[key] !== message[key]) {
		if(this.values.hasOwnProperty(key)) {
			this.values[key] = message[key]
			this._dirty = true;
		}
	}

	// If any of the values has changed, we're dirty - so send and update
	if(this._dirty)
		this.update();

};

StatusMonitor.prototype.update = function() {
	this._dirty = false;
	this._client.publish('/car/status', this.values);
};

//// [ SECURITY ] /////////////////////////////////////////////////////////////
//// [ IGNITION ] /////////////////////////////////////////////////////////////
//// [ CHARGING ] /////////////////////////////////////////////////////////////
//// [ TRAUMA LEVEL ] /////////////////////////////////////////////////////////
//// [ GPS ] //////////////////////////////////////////////////////////////////

module.exports = StatusMonitor;
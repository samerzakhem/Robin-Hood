var exec 			= require('child_process').exec,
	socket 			= require('../com/gm/socket'),
	StatusMonitor 	= require('./StatusMonitor');

function Vehicle(options) {
	this.options = options;

	if(this.options.server === undefined)
		throw new Error('Vehicle requires server')

	// Convenience 
	this.server 	= this.options.server;

	// Create a monitor that watches car status updates, 
	// and triggers change events where appropriate
	this.statusMonitor = new StatusMonitor({
	  url:      this.options.server.url,
	  channel:  '/car/status/update'
	});

	// Create a channel to send destination updates to the front-end
	this.HMIClient = new socket.FayeChannel({
		url: 		this.options.server.url,
		channel: 	'/hmi/location/update'
	});

}

//// [ STATIC ] ///////////////////////////////////////////////////////////////

//// [ GETTER/SETTER ] ////////////////////////////////////////////////////////

//// [ SECURITY ] /////////////////////////////////////////////////////////////

Vehicle.prototype.lock = function() {
	exec('say locking');
	exec("python /Users/onstar/Projects/RH/canbus/lock.py");
};

Vehicle.prototype.unlock = function() {
	exec('say unlocking');
	exec("python /Users/onstar/Projects/RH/canbus/unlock.py");
};

//// [ IGNITION ] /////////////////////////////////////////////////////////////

Vehicle.prototype.setIgnition = function(value) {
	exec('say ignition ' + (value ? 'on' : 'off'));
};

//// [ CHARGING ] /////////////////////////////////////////////////////////////
//// [ TRAUMA LEVEL ] /////////////////////////////////////////////////////////
//// [ GPS ] //////////////////////////////////////////////////////////////////

Vehicle.prototype.setLocation = function(latitude, longitude) {
	// body...
};

Vehicle.prototype.setDestination = function(msg) {
	this.HMIClient.send({
		destination: 	msg
	});
};

module.exports = Vehicle;
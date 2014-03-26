var Vehicle = (function() {

	var Vehicle = function() {
		this._events = {};

		this.values = {
			locked: 				false,
			ignition: 			false,
			charging: 			false,
			traumaLevel: 		1,
			batteryLevel: 	0,
			handsfree: 			false,
			user: 					undefined,
			latitude: 			NaN,
			longitude: 			NaN
		};

		// Setup a Faye listner on /car/status.  This will be the authority
		// for the car's current status, as returned by the backend
		this.faye = new Faye.Client(constants.SOCKET_URL);
		this.faye.subscribe('/car/status', this._onStatus.bind(this));
	}

	//// [ WEBSOCKET HANDLERS ] /////////////////////////////////////////////////
	
	Vehicle.prototype._onStatus = function(msg) {
		this.values = msg;
		this.fire('changed');
	};

	Vehicle.prototype._onLocationUpdate = function(msg) {
		this.fire('location', msg);
	};

	//// [ GENERAL ] ////////////////////////////////////////////////////////////
	
	Vehicle.prototype.update = function() {
		// Send the updated values to the websocket
		this.faye.publish('/car/status/update', this.values)
	};

	//// [ EVENT BROADCASTER ] //////////////////////////////////////////////////
	
	Vehicle.prototype.bind = function(eventName, callback) {
		var events 		= this._events,
			callbacks 	= events[eventName] = events[eventName] || [];

		callbacks.push(callback)
	};

	Vehicle.prototype.fire = function(eventName, args) {
		var callbacks 	= this._events[eventName] || [];
		for(var i = 0, l = callbacks.length ; i < l ; i++)
			callbacks[i].apply(this.scope, args)
	};

	//// [ LOCK/UNLOCK ] ////////////////////////////////////////////////////////

	Vehicle.prototype.lock = function() {
		this._setLockStatus(true);
	};

	Vehicle.prototype.unlock = function() {
		this._setLockStatus(false);
	};

	Vehicle.prototype._setLockStatus = function(value) {
		this.values.locked = value;
		this.update();
	};

	//// [ IGNITION STATUS ] ////////////////////////////////////////////////////
	
	Vehicle.prototype.setIgnition = function(value) {
		this.values.ignition = value;

		// Send the message to the API
		HMI.send(HMI.LetStarted(value));

		// Update internally
		this.update();
	};
	
	//// [ CHARGING ] ///////////////////////////////////////////////////////////
	
	Vehicle.prototype.setCharging = function(value) {
		this.values.charging = value;
		this.update();
	};

	//// [ TRAUMA LEVEL ] ///////////////////////////////////////////////////////
	
	Vehicle.prototype.setTraumaLevel = function(value) {
		this.values.traumaLevel = value;
		this.update();
	};

	//// [ HANDSFREE ] //////////////////////////////////////////////////////////

	Vehicle.prototype.setHandsfree = function(value) {
		this.values.handsfree = value;
		this.update();
	};

	//// [ GPS ] ////////////////////////////////////////////////////////////////
	
	Vehicle.prototype.setPosition = function(lat, lon) {
		this.values.latitude 	= lat;
		this.values.longitude 	= lon;

		// Also publish the lat/lon values on /car/location
		this.faye.publish('/car/location', {
			latitude: 	lat,
			longitude: 	lon
		});

		// Trigger the status update
		this.update();
	};

	//// [ USER INFORMATION ] ///////////////////////////////////////////////////

	Vehicle.prototype.setUser = function(value) {
		this.values.user 	= value;
		this.update();
	};

	Vehicle.prototype.getUser = function() {
		return this.values.user;
	};

	//// [ MISCELLANEOUS ] //////////////////////////////////////////////////////

	return new Vehicle();

})();
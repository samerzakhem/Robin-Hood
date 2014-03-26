var HMI = (function() {

	function HMI() {
		this._events = {};

		this.faye = new Faye.Client(constants.SOCKET_URL);
		this.faye.subscribe('/hmi/location/update', this._onLocationUpdate.bind(this));
	}

	//// [ STATIC ] ///////////////////////////////////////////////////////////////

	HMI.getInstance = function() {
		if(HMI.instance) {
			return HMI.instance;
		} else return HMI.instance = new HMI();
	}

	//// [ MISCELLANEOUS ] //////////////////////////////////////////////////////

	HMI.prototype.send = function(command) {
		this.faye.publish('/hmi/command', { command: command });
	};

	//// [ EVENT BROADCASTER ] //////////////////////////////////////////////////
	
	HMI.prototype.bind = function(eventName, callback) {
		var events 		= this._events,
			callbacks 	= events[eventName] = events[eventName] || [];

		callbacks.push(callback)
	};

	HMI.prototype.fire = function(eventName, args) {
		var callbacks 	= this._events[eventName] || [];
		for(var i = 0, l = callbacks.length ; i < l ; i++)
			callbacks[i].apply(this.scope, args)
	};

	//// [ EVENT LISTENERS ] //////////////////////////////////////////////////////

	HMI.prototype._onLocationUpdate = function(msg) {
		this.fire('location', [msg]);	
	};

	//// [ CHIME ] ////////////////////////////////////////////////////////////////

	HMI.prototype.SetChime = function(type, count) {
		return {
			"chime.SetChime": {
			  chime: 	type,
			  count: 	count
			}
		}
	};

	//// [ GAZE ] /////////////////////////////////////////////////////////////////
	//// [ GPS ] //////////////////////////////////////////////////////////////////

	HMI.prototype.LetPosition = function(latitude, longitude) {
		return {
			"gps.LetPosition": {
			  longitude: 	longitude,
			  latitude: 	latitude
			}
		}
	};

	//// [ HEAD ] /////////////////////////////////////////////////////////////////
	//// [ LEAP ] /////////////////////////////////////////////////////////////////

	HMI.prototype.leap = {};
	
	HMI.prototype.leap.LetCursor = function(x, y, phase) {
		return {
			"leap.LetCursor": {
			  phase: 	phase,
			  x: 			x,
			  y: 			y
			}
		}
	};

	HMI.prototype.leap.LetScroll = function(deltaX, deltaY, velocityX, velocityY, phase, fingerCount) {
		return {
			"leap.LetScroll": {
			  fingerCount: 	fingerCount,
			  phase: 				phase,
			  velocityX: 		velocityX,
			  velocityY: 		velocityY,
			  deltaY: 			deltaY,
			  deltaX: 			deltaX
			}
		}
	};

	HMI.prototype.leap.LetPoke = function(x, y, fingerCount, clickCount) {
		return {
			"leap.LetPoke": {
				clickCount: 		clickCount,
				fingerCount: 		fingerCount,
				x: 							x,
				y: 							y
			}
		}
	};

	HMI.prototype.leap.LetRotate = function(deltaAngle, fingerCount) {
		return {
			"leap.LetRotate": {
			  deltaAngle: 	deltaAngle,
			  fingerCount: 	fingerCount
			}
		}
	};

	HMI.prototype.leap.LetZoom = function(deltaZoom, fingerCount) {
		return {
			"leap.LetZoom": {
			  deltaZoom: 		deltaZoom,
			  fingerCount: 	fingerCount
			}
		}
	};

	HMI.prototype.leap.LetGesture = function(gesture) {
		return {
			"leap.LetGesture": {
			  gesture: 	gesture
			}
		}
	};

	//// [ NAVIGATION ] ///////////////////////////////////////////////////////////

	HMI.prototype.GetWaypoints = function() {
		return {
			"navigation.GetWaypoints": {}
		}
	};

	HMI.prototype.SetWaypoints = function(waypoints) {
		return {
			"navigation.SetWaypoints": {
			  waypoints: 	waypoints
			}
		}
	};

	HMI.prototype.LetWaypoints = function(waypoints) {
		return {
			"navigation.LetWaypoints": {
			  waypoints: 	waypoints
			}
		}
	};

	//// [ NOTICE ] ///////////////////////////////////////////////////////////////

	HMI.prototype.SetAddNotice = function(notice) {
		return {
			"notice.SetAddNotice": {
			  notice: 	notice
			}
		}
	};

	HMI.prototype.GetStatus = function(notice) {
		return {
			"notice.GetStatus": {}
		}
	};

	HMI.prototype.LetStatus = function(count) {
		return {
			"notice.LetStatus": {
			  count: 	count
			}
		}
	};

	HMI.prototype.GetNotices = function(start, end) {
		return {
			"notice.GetNotices": {
			  start: 	start,
			  end: 		end
			}
		}
	};

	HMI.prototype.LetNotices = function(start, notices) {
		return {
			"notice.LetNotices": {
			  start: 		start,
			  notices: 	notices
			}
		}
	};

	HMI.prototype.SetDeleteNotice = function(id) {
		return {
			"notice.SetDeleteNotice": {
			  id: 	id
			}
		}
	};

	//// [ PHONE ] ////////////////////////////////////////////////////////////////

	HMI.prototype.GetCharging = function() {
		return {
			"phone.GetCharging": {}
		}
	};

	HMI.prototype.LetCharging = function(charging) {
		return {
			"phone.LetCharging": {
			  value: 	charging
			}
		}
	};

	HMI.prototype.GetHandsFree = function() {
		return {
			"phone.GetHandsFree": {}
		}
	};

	HMI.prototype.SetHandsFree = function(handsfree) {
		return {
			"phone.SetHandsFree": {
			  value: 	handsfree
			}
		}
	};

	HMI.prototype.LetHandsFree = function(handsfree) {
		return {
			"phone.LetHandsFree": {
			  value: 	handsfree
			}
		}
	};

	HMI.prototype.SetAction = function(action, number) {
		return {
			"phone.SetAction": {
			  number: 		number,
			  action: 		action
			}
		}
	};

	HMI.prototype.GetCallDuration = function() {
		return {
			"phone.GetCallDuration": {}
		}
	};

	HMI.prototype.LetCallDuration = function(duration) {
		return {
			"phone.LetCallDuration": {
			  value: 	duration
			}
		}
	};

	HMI.prototype.GetStatus = function() {
		return {
			"phone.GetStatus": {}
		}
	};

	HMI.prototype.LetStatus = function(status) {
		return {
			"phone.LetStatus": {
			  value: 	status
			}
		}
	};

	HMI.prototype.SetText = function(recipient, text) {
		return {
			"phone.SetText": {
				recipient: 		recipient,
				text: 				text
			}
		}
	};

	//// [ PROXIMITY ] ////////////////////////////////////////////////////////////

	HMI.prototype.GetProximity = function() {
		return {
			"proximity.GetProximity": {}
		}
	};

	HMI.prototype.LetProximity = function(name, proximity) {
		return {
			"proximity.LetProximity": {
				name: 			name,
				proximity: 	proximity
			}
		}
	};

	//// [ SWC ] //////////////////////////////////////////////////////////////////

	HMI.prototype.swc = {};

	HMI.prototype.swc.LetCursor = function(x, y, phase) {
		return {
			"swc.LetCursor": {
				phase: 		phase,
				x: 				x,
				y: 				y
			}
		}
	};

	HMI.prototype.swc.LetScroll = function(deltaX, deltaY, velocityX, velocityY, phase, fingerCount) {
		return {
			"swc.LetScroll": {
				deltaX: 			deltaX,
				deltaY: 			deltaY,
				velocityX: 		velocityX,
				velocityY: 		velocityY,
				phase: 				phase,
				fingerCount: 	fingerCount
			}
		}
	};

	HMI.prototype.swc.LetTap = function(x, y, fingerCount, clickCount) {
		return {
			"swc.LetTap": {
			  fingerCount: 		fingerCount,
			  clickCount: 		clickCount,
			  x: 							x,
			  y: 							y
			}
		}
	};

	HMI.prototype.swc.LetRotate = function(deltaAngle, fingerCount) {
		return {
			"swc.LetRotate": {
				deltaAngle: 		deltaAngle,
				fingerCount: 		fingerCount
			}
		}
	};

	HMI.prototype.swc.LetZoom = function(deltaZoom, fingerCount) {
		return {
			"swc.LetZoom": {
				deltaZoom: 		deltaZoom,
				fingerCount: 	fingerCount
			}
		}
	};

	HMI.prototype.swc.LetGesture = function(gesture) {
		return {
			"swc.LetGesture": {
				gesture: 		gesture
			}
		}
	};

	//// [ TOUCH ] ////////////////////////////////////////////////////////////////

	HMI.prototype.touch = {};

	HMI.prototype.touch.LetCursor = function(x, y, phase) {
		return {
			"touch.LetCursor": {
				phase: 		phase,
				x: 				x,
				y: 				y
			}
		}
	};

	HMI.prototype.touch.LetScroll = function(deltaX, deltaY, velocityX, velocityY, phase, fingerCount) {
		return {
			"touch.LetScroll": {
				deltaX: 			deltaX,
				deltaY: 			deltaY,
				velocityX: 		velocityX,
				velocityY: 		velocityY,
				phase: 				phase,
				fingerCount: 	fingerCount
			}
		}
	};

	HMI.prototype.touch.LetTap = function(x, y, fingerCount, clickCount) {
		return {
			"touch.LetTap": {
			  fingerCount: 		fingerCount,
			  clickCount: 		clickCount,
			  x: 							x,
			  y: 							y
			}
		}
	};

	HMI.prototype.touch.LetRotate = function(deltaAngle, fingerCount) {
		return {
			"touch.LetRotate": {
				deltaAngle: 		deltaAngle,
				fingerCount: 		fingerCount
			}
		}
	};

	HMI.prototype.touch.LetZoom = function(deltaZoom, fingerCount) {
		return {
			"touch.LetZoom": {
				deltaZoom: 		deltaZoom,
				fingerCount: 	fingerCount
			}
		}
	};

	HMI.prototype.touch.LetGesture = function(gesture) {
		return {
			"touch.LetGesture": {
				gesture: 		gesture
			}
		}
	};

	//// [ TRAUMA ] ///////////////////////////////////////////////////////////////

	HMI.prototype.GetLevel = function() {
		return {
			"trauma.GetLevel": {}
		}
	};

	HMI.prototype.LetLevel = function(level) {
		return {
			"trauma.LetLevel": {
				level: 		level
			}
		}
	};

	//// [ VEHICLE ] //////////////////////////////////////////////////////////////

	HMI.prototype.GetLocked = function() {
		return {
			"vehicle.GetLocked": {}
		}
	};

	HMI.prototype.SetLocked = function(locked) {
		return {
			"vehicle.SetLocked": {
				value: 	locked
			}
		}
	};

	HMI.prototype.LetLocked = function(locked) {
		return {
			"vehicle.LetLocked": {
				value: 	locked
			}
		}
	};

	HMI.prototype.SetHonk = function(time) {
		return {
			"vehicle.SetHonk": {
				value: 	time
			}
		}
	};

	HMI.prototype.LetDriverDoorOpen = function(value) {
		return {
			"vehicle.LetDriverDoorOpen": {
				value: 	value
			}
		}
	};

	HMI.prototype.LetStarted = function(value) {
		return {
			"vehicle.LetStarted": {
				value: 	value
			}
		}
	};

	HMI.prototype.LetDriverSeated = function(value) {
		return {
			"vehicle.LetDriverSeated": {
				value: 	value
			}
		}
	};

	HMI.prototype.LetSpeed = function(value) {
		return {
			"vehicle.LetSpeed": {
				value: 	value
			}
		}
	};

	HMI.prototype.SetVolume = function(value) {
		return { 
			"amp.SetVolume": { 
				value: value 
			}
		}
	};

	HMI.prototype.LetWelcome = function(title, subtitle) {
		return {
			"vehicle.LetWelcome": {
				title: 		title,
				subtitle: 	subtitle
			}
		}
	};

	HMI.prototype.LetGoodbye = function() {
		return {
			"vehicle.LetGoodbye": {}
		}
	};

	return HMI.getInstance();

})();

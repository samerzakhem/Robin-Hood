function HMIFormatter() {

}

//// [ STATIC ] ///////////////////////////////////////////////////////////////

HMIFormatter.getInstance = function() {
	if(HMIFormatter.instance) {
		return HMIFormatter.instance;
	} else return HMIFormatter.instance = new HMIFormatter();
}

//// [ CHIME ] ////////////////////////////////////////////////////////////////

HMIFormatter.prototype.SetChime = function(type, count) {
	return {
		"chime.SetChime": {
		  chime: 	type,
		  count: 	count
		}
	}
};

//// [ GAZE ] /////////////////////////////////////////////////////////////////
//// [ GPS ] //////////////////////////////////////////////////////////////////

HMIFormatter.prototype.LetPosition = function(latitude, longitude) {
	return {
		"gps.LetPosition": {
		  longitude: 	longitude,
		  latitude: 	latitude
		}
	}
};

HMIFormatter.prototype.SetEndByAddress = function(address) {
	return {
		"gps.SetEndByAddress": {
			value: address
		}
	}
};

//// [ HEAD ] /////////////////////////////////////////////////////////////////
//// [ LEAP ] /////////////////////////////////////////////////////////////////

HMIFormatter.prototype.leap = {};

HMIFormatter.prototype.leap.LetCursor = function(x, y, phase) {
	return {
		"leap.LetCursor": {
		  phase: 	phase,
		  x: 			x,
		  y: 			y
		}
	}
};

HMIFormatter.prototype.leap.LetScroll = function(deltaX, deltaY, velocityX, velocityY, phase, fingerCount) {
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

HMIFormatter.prototype.leap.LetPoke = function(x, y, fingerCount, clickCount) {
	return {
		"leap.LetPoke": {
			clickCount: 		clickCount,
			fingerCount: 		fingerCount,
			x: 							x,
			y: 							y
		}
	}
};

HMIFormatter.prototype.leap.LetRotate = function(deltaAngle, fingerCount) {
	return {
		"leap.LetRotate": {
		  deltaAngle: 	deltaAngle,
		  fingerCount: 	fingerCount
		}
	}
};

HMIFormatter.prototype.leap.LetZoom = function(deltaZoom, fingerCount) {
	return {
		"leap.LetZoom": {
		  deltaZoom: 		deltaZoom,
		  fingerCount: 	fingerCount
		}
	}
};

HMIFormatter.prototype.leap.LetGesture = function(gesture) {
	return {
		"leap.LetGesture": {
		  gesture: 	gesture
		}
	}
};

//// [ NAVIGATION ] ///////////////////////////////////////////////////////////

HMIFormatter.prototype.GetWaypoints = function() {
	return {
		"navigation.GetWaypoints": {}
	}
};

HMIFormatter.prototype.SetWaypoints = function(waypoints) {
	return {
		"navigation.SetWaypoints": {
		  waypoints: 	waypoints
		}
	}
};

HMIFormatter.prototype.LetWaypoints = function(waypoints) {
	return {
		"navigation.LetWaypoints": {
		  waypoints: 	waypoints
		}
	}
};

//// [ NOTICE ] ///////////////////////////////////////////////////////////////

HMIFormatter.prototype.SetAddNotice = function(notice) {
	return {
		"notice.SetAddNotice": {
		  notice: 	notice
		}
	}
};

HMIFormatter.prototype.GetStatus = function(notice) {
	return {
		"notice.GetStatus": {}
	}
};

HMIFormatter.prototype.LetStatus = function(count) {
	return {
		"notice.LetStatus": {
		  count: 	count
		}
	}
};

HMIFormatter.prototype.GetNotices = function(start, end) {
	return {
		"notice.GetNotices": {
		  start: 	start,
		  end: 		end
		}
	}
};

HMIFormatter.prototype.LetNotices = function(start, notices) {
	return {
		"notice.LetNotices": {
		  start: 		start,
		  notices: 	notices
		}
	}
};

HMIFormatter.prototype.SetDeleteNotice = function(id) {
	return {
		"notice.SetDeleteNotice": {
		  id: 	id
		}
	}
};

//// [ PHONE ] ////////////////////////////////////////////////////////////////

HMIFormatter.prototype.GetCharging = function() {
	return {
		"phone.GetCharging": {}
	}
};

HMIFormatter.prototype.LetCharging = function(charging) {
	return {
		"phone.LetCharging": {
		  value: 	charging
		}
	}
};

HMIFormatter.prototype.LetChargeLevel = function(level) {
	return {
		"phone.LetChargeLevel": {
			value: 	level
		}
	}
};

HMIFormatter.prototype.GetHandsFree = function() {
	return {
		"phone.GetHandsFree": {}
	}
};

HMIFormatter.prototype.SetHandsFree = function(handsfree) {
	return {
		"phone.SetHandsFree": {
		  value: 	handsfree
		}
	}
};

HMIFormatter.prototype.LetHandsFree = function(handsfree) {
	return {
		"phone.LetHandsFree": {
		  value: 	handsfree
		}
	}
};

HMIFormatter.prototype.SetAction = function(action, number) {
	return {
		"phone.SetAction": {
		  number: 		number,
		  action: 		action
		}
	}
};

HMIFormatter.prototype.GetCallDuration = function() {
	return {
		"phone.GetCallDuration": {}
	}
};

HMIFormatter.prototype.LetCallDuration = function(duration) {
	return {
		"phone.LetCallDuration": {
		  value: 	duration
		}
	}
};

HMIFormatter.prototype.GetStatus = function() {
	return {
		"phone.GetStatus": {}
	}
};

HMIFormatter.prototype.LetStatus = function(status) {
	return {
		"phone.LetStatus": {
		  value: 	status
		}
	}
};

HMIFormatter.prototype.SetText = function(recipient, text) {
	return {
		"phone.SetText": {
			recipient: 		recipient,
			text: 				text
		}
	}
};

//// [ PROXIMITY ] ////////////////////////////////////////////////////////////

HMIFormatter.prototype.GetProximity = function() {
	return {
		"proximity.GetProximity": {}
	}
};

HMIFormatter.prototype.LetProximity = function(name, proximity) {
	return {
		"proximity.LetProximity": {
			name: 			name,
			proximity: 	proximity
		}
	}
};

//// [ SWC ] //////////////////////////////////////////////////////////////////

HMIFormatter.prototype.swc = {};

HMIFormatter.prototype.swc.LetCursor = function(x, y, phase) {
	return {
		"swc.LetCursor": {
			phase: 		phase,
			x: 				x,
			y: 				y
		}
	}
};

HMIFormatter.prototype.swc.LetScroll = function(deltaX, deltaY, velocityX, velocityY, phase, fingerCount) {
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

HMIFormatter.prototype.swc.LetTap = function(x, y, fingerCount, clickCount) {
	return {
		"swc.LetTap": {
		  fingerCount: 		fingerCount,
		  clickCount: 		clickCount,
		  x: 							x,
		  y: 							y
		}
	}
};

HMIFormatter.prototype.swc.LetRotate = function(deltaAngle, fingerCount) {
	return {
		"swc.LetRotate": {
			deltaAngle: 		deltaAngle,
			fingerCount: 		fingerCount
		}
	}
};

HMIFormatter.prototype.swc.LetZoom = function(deltaZoom, fingerCount) {
	return {
		"swc.LetZoom": {
			deltaZoom: 		deltaZoom,
			fingerCount: 	fingerCount
		}
	}
};

HMIFormatter.prototype.swc.LetGesture = function(gesture) {
	return {
		"swc.LetGesture": {
			gesture: 		gesture
		}
	}
};

//// [ TOUCH ] ////////////////////////////////////////////////////////////////

HMIFormatter.prototype.touch = {};

HMIFormatter.prototype.touch.LetCursor = function(x, y, phase) {
	return {
		"touch.LetCursor": {
			phase: 		phase,
			x: 				x,
			y: 				y
		}
	}
};

HMIFormatter.prototype.touch.LetScroll = function(deltaX, deltaY, velocityX, velocityY, phase, fingerCount) {
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

HMIFormatter.prototype.touch.LetTap = function(x, y, fingerCount, clickCount) {
	return {
		"touch.LetTap": {
		  fingerCount: 		fingerCount,
		  clickCount: 		clickCount,
		  x: 							x,
		  y: 							y
		}
	}
};

HMIFormatter.prototype.touch.LetRotate = function(deltaAngle, fingerCount) {
	return {
		"touch.LetRotate": {
			deltaAngle: 		deltaAngle,
			fingerCount: 		fingerCount
		}
	}
};

HMIFormatter.prototype.touch.LetZoom = function(deltaZoom, fingerCount) {
	return {
		"touch.LetZoom": {
			deltaZoom: 		deltaZoom,
			fingerCount: 	fingerCount
		}
	}
};

HMIFormatter.prototype.touch.LetGesture = function(gesture) {
	return {
		"touch.LetGesture": {
			gesture: 		gesture
		}
	}
};

//// [ TRAUMA ] ///////////////////////////////////////////////////////////////

HMIFormatter.prototype.GetLevel = function() {
	return {
		"trauma.GetLevel": {}
	}
};

HMIFormatter.prototype.LetLevel = function(level) {
	return {
		"trauma.LetLevel": {
			level: 		['', 'none', 'low', 'high'][level]
		}
	}
};

//// [ VEHICLE ] //////////////////////////////////////////////////////////////

HMIFormatter.prototype.GetLocked = function() {
	return {
		"vehicle.GetLocked": {}
	}
};

HMIFormatter.prototype.SetLocked = function(locked) {
	return {
		"vehicle.SetLocked": {
			value: 	locked
		}
	}
};

HMIFormatter.prototype.LetLocked = function(locked) {
	return {
		"vehicle.LetLocked": {
			value: 	locked
		}
	}
};

HMIFormatter.prototype.SetHonk = function(time) {
	return {
		"vehicle.SetHonk": {
			value: 	time
		}
	}
};

HMIFormatter.prototype.LetDriverDoorOpen = function(value) {
	return {
		"vehicle.LetDriverDoorOpen": {
			value: 	value
		}
	}
};

HMIFormatter.prototype.LetStarted = function(value) {
	return {
		"vehicle.LetStarted": {
			value: 	value
		}
	}
};

HMIFormatter.prototype.LetDriverSeated = function(value) {
	return {
		"vehicle.LetDriverSeated": {
			value: 	value
		}
	}
};

HMIFormatter.prototype.LetSpeed = function(value) {
	return {
		"vehicle.LetSpeed": {
			value: 	value
		}
	}
};

module.exports = HMIFormatter.getInstance();
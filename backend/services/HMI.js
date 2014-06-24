var formatter 	= require('./HMIFormatter'),
		socket 			= require('../com/gm/socket')

function HMI(options) {
	this.options = options;

	if(HMI.instance) {
		throw new Error("HMI already instanciated, try HMI.getInstance()")
	} else HMI.instance = this;

	if(this.options.url === undefined)
		throw new Error('HMI expects socketURL')

  if(this.options.debug === undefined)
  	this.options.debug = false;

	// Initialize the websocket connection
	this.socket = new socket.WebSocket({
		url:        this.options.url,
		scope: 			this,
		onOpen:     function(e) {
			console.log(">> [HMI] Connected!");
			this.identify('GM Backend');
		},
		onClose: 		function() {
			console.log("!! [HMI] Disconnected!");
		}
	});

}

//// [ STATIC ] ///////////////////////////////////////////////////////////////

HMI.getInstance = function(options) {
	if(HMI.instance) {
		return HMI.instance;
	} else return HMI.instance = new HMI(options);
}

//// [ DEBUG HELPERS ] ////////////////////////////////////////////////////////

HMI.prototype.sendRaw = function(message) {
	this.send( message );
};

HMI.prototype.identify = function(name) {
	this.send({
		"span.LetClientMetadata": {
		  name:  						name,
		  clientCategory: 	"Service",
		  echo: 						false
		}
	});
};

HMI.prototype.send = function(message) {
	if(this.options.debug)
		console.log("<< [HMI]:", message);

	this.socket.send(message);
};

//// [ MESSAGING ] ////////////////////////////////////////////////////////////

HMI.prototype.sendMessage = function(msg) {

	var options = {
		text: 	[
			{
		        data: 		msg.text,
		        action: 	"tts",
		        name: 		"Listen"
			},
		    {
		        action: 	"sendMessage",
		        name: 		"Reply"
		    }
		],

		mail: 	[],

		socialMedia: 	[]
	}

	// MSG: { from: 'From', type: 'sms', priority: 'low', text: 'text' }
	this.SetAddNotice({
	    priority: 	msg.priority,
	    type: 		msg.type,
	    options: 	options[ msg.type ],
	    text: 		msg.text,
	    title: 		msg.from
	});
};

//// [ CHIME ] ////////////////////////////////////////////////////////////////

HMI.prototype.SetChime = function(type, count) {
	this.send( formatter.SetChime.apply(this, arguments) );
};

//// [ GAZE ] /////////////////////////////////////////////////////////////////
//// [ GPS ] //////////////////////////////////////////////////////////////////

HMI.prototype.LetPosition = function(latitude, longitude) {
	this.send( formatter.LetPosition.apply(this, arguments) );
};

HMI.prototype.SetEndByAddress = function(address) {
	this.send( formatter.SendEndByAddress.apply(this, arguments) );
};

//// [ HEAD ] /////////////////////////////////////////////////////////////////
//// [ LEAP ] /////////////////////////////////////////////////////////////////

HMI.prototype.leap = {};

HMI.prototype.leap.LetCursor = function(x, y, phase) {
	this.send( formatter.leap.LetCursor.apply(this, arguments) );
};

HMI.prototype.leap.LetScroll = function(deltaX, deltaY, velocityX, velocityY, phase, fingerCount) {
	this.send( formatter.leap.LetScroll.apply(this, arguments) );
};

HMI.prototype.leap.LetPoke = function(x, y, fingerCount, clickCount) {
	this.send( formatter.leap.LetPoke.apply(this, arguments) );
};

HMI.prototype.leap.LetRotate = function(deltaAngle, fingerCount) {
	this.send( formatter.leap.LetRotate.apply(this, arguments) );
};

HMI.prototype.leap.LetZoom = function(deltaZoom, fingerCount) {
	this.send( formatter.leap.LetZoom.apply(this, arguments) );
};

HMI.prototype.leap.LetGesture = function(gesture) {
	this.send( formatter.leap.LetGesture.apply(this, arguments) );
};

//// [ NAVIGATION ] ///////////////////////////////////////////////////////////

HMI.prototype.GetWaypoints = function() {
	this.send( formatter.GetWaypoints.apply(this, arguments) );
};

HMI.prototype.SetWaypoints = function(waypoints) {
	this.send( formatter.SetWaypoints.apply(this, arguments) );
};

HMI.prototype.LetWaypoints = function(waypoints) {
	this.send( formatter.LetWaypoints.apply(this, arguments) );
};

//// [ NOTICE ] ///////////////////////////////////////////////////////////////

HMI.prototype.SetAddNotice = function(notice) {
	this.send( formatter.SetAddNotice.apply(this, arguments) );
};

HMI.prototype.GetStatus = function(notice) {
	this.send( formatter.GetStatus.apply(this, arguments) );
};

HMI.prototype.LetStatus = function(count) {
	this.send( formatter.LetStatus.apply(this, arguments) );
};

HMI.prototype.GetNotices = function(start, end) {
	this.send( formatter.GetNotices.apply(this, arguments) );
};

HMI.prototype.LetNotices = function(start, notices) {
	this.send( formatter.LetNotices.apply(this, arguments) );
};

HMI.prototype.SetDeleteNotice = function(id) {
	this.send( formatter.SetDeleteNotice.apply(this, arguments) );
};

//// [ PHONE ] ////////////////////////////////////////////////////////////////

HMI.prototype.GetCharging = function() {
	this.send( formatter.GetCharging.apply(this, arguments) );
};

HMI.prototype.LetCharging = function(charging) {
	this.send( formatter.LetCharging.apply(this, arguments) );
};

HMI.prototype.LetChargeLevel = function(level) {
	console.log(">> BATTERY", formatter.LetChargeLevel.apply(this, arguments))
	this.send( formatter.LetChargeLevel.apply(this, arguments) );
};

HMI.prototype.GetHandsFree = function() {
	this.send( formatter.GetHandsFree.apply(this, arguments) );
};

HMI.prototype.SetHandsFree = function(handsfree) {
	this.send( formatter.SetHandsFree.apply(this, arguments) );
};

HMI.prototype.LetHandsFree = function(handsfree) {
	this.send( formatter.LetHandsFree.apply(this, arguments) );
};

HMI.prototype.SetAction = function(action, number) {
	this.send( formatter.SetAction.apply(this, arguments) );
};

HMI.prototype.GetCallDuration = function() {
	this.send( formatter.GetCallDuration.apply(this, arguments) );
};

HMI.prototype.LetCallDuration = function(duration) {
	this.send( formatter.LetCallDuration.apply(this, arguments) );
};

HMI.prototype.GetStatus = function() {
	this.send( formatter.GetStatus.apply(this, arguments) );
};

HMI.prototype.LetStatus = function(status) {
	this.send( formatter.LetStatus.apply(this, arguments) );
};

HMI.prototype.SetText = function(recipient, text) {
	this.send( formatter.SetText.apply(this, arguments) );
};

//// [ PROXIMITY ] ////////////////////////////////////////////////////////////

HMI.prototype.GetProximity = function() {
	this.send( formatter.GetProximity.apply(this, arguments) );
};

HMI.prototype.LetProximity = function(name, proximity) {
	this.send( formatter.LetProximity.apply(this, arguments) );
};

//// [ SWC ] //////////////////////////////////////////////////////////////////

HMI.prototype.swc = {};

HMI.prototype.swc.LetCursor = function(x, y, phase) {
	this.send( formatter.swc.LetCursor.apply(this, arguments) );
};

HMI.prototype.swc.LetScroll = function(deltaX, deltaY, velocityX, velocityY, phase, fingerCount) {
	this.send( formatter.swc.LetScroll.apply(this, arguments) );
};

HMI.prototype.swc.LetTap = function(x, y, fingerCount, clickCount) {
	this.send( formatter.swc.LetTap.apply(this, arguments) );
};

HMI.prototype.swc.LetRotate = function(deltaAngle, fingerCount) {
	this.send( formatter.swc.LetRotate.apply(this, arguments) );
};

HMI.prototype.swc.LetZoom = function(deltaZoom, fingerCount) {
	this.send( formatter.swc.LetZoom.apply(this, arguments) );
};

HMI.prototype.swc.LetGesture = function(gesture) {
	this.send( formatter.swc.LetGesture.apply(this, arguments) );
};

//// [ TOUCH ] ////////////////////////////////////////////////////////////////

HMI.prototype.touch = {};

HMI.prototype.touch.LetCursor = function(x, y, phase) {
	this.send( formatter.touch.LetCursor.apply(this, arguments) );
};

HMI.prototype.touch.LetScroll = function(deltaX, deltaY, velocityX, velocityY, phase, fingerCount) {
	this.send( formatter.touch.LetScroll.apply(this, arguments) );
};

HMI.prototype.touch.LetTap = function(x, y, fingerCount, clickCount) {
	this.send( formatter.touch.LetTap.apply(this, arguments) );
};

HMI.prototype.touch.LetRotate = function(deltaAngle, fingerCount) {
	this.send( formatter.touch.LetRotate.apply(this, arguments) );
};

HMI.prototype.touch.LetZoom = function(deltaZoom, fingerCount) {
	this.send( formatter.touch.LetZoom.apply(this, arguments) );
};

HMI.prototype.touch.LetGesture = function(gesture) {
	this.send( formatter.touch.LetGesture.apply(this, arguments) );
};

//// [ TRAUMA ] ///////////////////////////////////////////////////////////////

HMI.prototype.GetLevel = function() {
	this.send( formatter.GetLevel.apply(this, arguments) );
};

HMI.prototype.LetLevel = function(level) {
	this.send( formatter.LetLevel.apply(this, arguments) );
};

//// [ VEHICLE ] //////////////////////////////////////////////////////////////

HMI.prototype.GetLocked = function() {
	this.send( formatter.GetLocked.apply(this, arguments) );
};

HMI.prototype.SetLocked = function(locked) {
	this.send( formatter.SetLocked.apply(this, arguments) );
};

HMI.prototype.LetLocked = function(locked) {
	this.send( formatter.LetLocked.apply(this, arguments) );
};

HMI.prototype.SetHonk = function(time) {
	this.send( formatter.SetHonk.apply(this, arguments) );
};

HMI.prototype.LetDriverDoorOpen = function(value) {
	this.send( formatter.LetDriverDoorOpen.apply(this, arguments) );
};

HMI.prototype.LetStarted = function(value) {
	this.send( formatter.LetStarted.apply(this, arguments) );
};

HMI.prototype.LetDriverSeated = function(value) {
	this.send( formatter.LetDriverSeated.apply(this, arguments) );
};

HMI.prototype.LetSpeed = function(value) {
	this.send( formatter.LetSpeed.apply(this, arguments) );
};

module.exports = HMI;
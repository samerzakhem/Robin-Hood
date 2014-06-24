var formatter 	= require('./HMIFormatter'),
		socket 			= require('../com/gm/socket')

function HMI(options) {
	this.options = options;

	if(HMI.instance) {
		throw new Error("HMI already instanciated, try HMI.getInstance()")
	} else HMI.instance = this;

	if(this.options.url === undefined)
		throw new Error('HMI expects socketURL')

	if(this.options.debug == undefined)
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

HMI.prototype.sendMessage = function(message) {
	if(this.options.debug)
		console.log(">> [HMI SEND]:", message)

	this.socket.send(message);
};

HMI.prototype.sendRaw = function(message) {
	this.socket.send( message );
};

HMI.prototype.identify = function(name) {
	this.sendMessage({
		"span.LetClientMetadata": {
		  name:  						name,
		  clientCategory: 	"Service",
		  echo: 						false
		}
	});
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
	this.sendMessage( formatter.SetChime.apply(this, arguments) );
};

//// [ GAZE ] /////////////////////////////////////////////////////////////////
//// [ GPS ] //////////////////////////////////////////////////////////////////

HMI.prototype.LetPosition = function(latitude, longitude) {
	this.sendMessage( formatter.LetPosition.apply(this, arguments) );
};

HMI.prototype.SetEndByAddress = function(address) {
	this.sendMessage( formatter.SendEndByAddress.apply(this, arguments) );
};

//// [ HEAD ] /////////////////////////////////////////////////////////////////
//// [ LEAP ] /////////////////////////////////////////////////////////////////

HMI.prototype.leap = {};

HMI.prototype.leap.LetCursor = function(x, y, phase) {
	this.sendMessage( formatter.leap.LetCursor.apply(this, arguments) );
};

HMI.prototype.leap.LetScroll = function(deltaX, deltaY, velocityX, velocityY, phase, fingerCount) {
	this.sendMessage( formatter.leap.LetScroll.apply(this, arguments) );
};

HMI.prototype.leap.LetPoke = function(x, y, fingerCount, clickCount) {
	this.sendMessage( formatter.leap.LetPoke.apply(this, arguments) );
};

HMI.prototype.leap.LetRotate = function(deltaAngle, fingerCount) {
	this.sendMessage( formatter.leap.LetRotate.apply(this, arguments) );
};

HMI.prototype.leap.LetZoom = function(deltaZoom, fingerCount) {
	this.sendMessage( formatter.leap.LetZoom.apply(this, arguments) );
};

HMI.prototype.leap.LetGesture = function(gesture) {
	this.sendMessage( formatter.leap.LetGesture.apply(this, arguments) );
};

//// [ NAVIGATION ] ///////////////////////////////////////////////////////////

HMI.prototype.GetWaypoints = function() {
	this.sendMessage( formatter.GetWaypoints.apply(this, arguments) );
};

HMI.prototype.SetWaypoints = function(waypoints) {
	this.sendMessage( formatter.SetWaypoints.apply(this, arguments) );
};

HMI.prototype.LetWaypoints = function(waypoints) {
	this.sendMessage( formatter.LetWaypoints.apply(this, arguments) );
};

//// [ NOTICE ] ///////////////////////////////////////////////////////////////

HMI.prototype.SetAddNotice = function(notice) {
	this.sendMessage( formatter.SetAddNotice.apply(this, arguments) );
};

HMI.prototype.GetStatus = function(notice) {
	this.sendMessage( formatter.GetStatus.apply(this, arguments) );
};

HMI.prototype.LetStatus = function(count) {
	this.sendMessage( formatter.LetStatus.apply(this, arguments) );
};

HMI.prototype.GetNotices = function(start, end) {
	this.sendMessage( formatter.GetNotices.apply(this, arguments) );
};

HMI.prototype.LetNotices = function(start, notices) {
	this.sendMessage( formatter.LetNotices.apply(this, arguments) );
};

HMI.prototype.SetDeleteNotice = function(id) {
	this.sendMessage( formatter.SetDeleteNotice.apply(this, arguments) );
};

//// [ PHONE ] ////////////////////////////////////////////////////////////////

HMI.prototype.GetCharging = function() {
	this.sendMessage( formatter.GetCharging.apply(this, arguments) );
};

HMI.prototype.LetCharging = function(charging) {
	this.sendMessage( formatter.LetCharging.apply(this, arguments) );
};

HMI.prototype.LetChargeLevel = function(level) {
	console.log(">> BATTERY", formatter.LetChargeLevel.apply(this, arguments))
	this.sendMessage( formatter.LetChargeLevel.apply(this, arguments) );
};

HMI.prototype.GetHandsFree = function() {
	this.sendMessage( formatter.GetHandsFree.apply(this, arguments) );
};

HMI.prototype.SetHandsFree = function(handsfree) {
	this.sendMessage( formatter.SetHandsFree.apply(this, arguments) );
};

HMI.prototype.LetHandsFree = function(handsfree) {
	this.sendMessage( formatter.LetHandsFree.apply(this, arguments) );
};

HMI.prototype.SetAction = function(action, number) {
	this.sendMessage( formatter.SetAction.apply(this, arguments) );
};

HMI.prototype.GetCallDuration = function() {
	this.sendMessage( formatter.GetCallDuration.apply(this, arguments) );
};

HMI.prototype.LetCallDuration = function(duration) {
	this.sendMessage( formatter.LetCallDuration.apply(this, arguments) );
};

HMI.prototype.GetStatus = function() {
	this.sendMessage( formatter.GetStatus.apply(this, arguments) );
};

HMI.prototype.LetStatus = function(status) {
	this.sendMessage( formatter.LetStatus.apply(this, arguments) );
};

HMI.prototype.SetText = function(recipient, text) {
	this.sendMessage( formatter.SetText.apply(this, arguments) );
};

//// [ PROXIMITY ] ////////////////////////////////////////////////////////////

HMI.prototype.GetProximity = function() {
	this.sendMessage( formatter.GetProximity.apply(this, arguments) );
};

HMI.prototype.LetProximity = function(name, proximity) {
	this.sendMessage( formatter.LetProximity.apply(this, arguments) );
};

//// [ SWC ] //////////////////////////////////////////////////////////////////

HMI.prototype.swc = {};

HMI.prototype.swc.LetCursor = function(x, y, phase) {
	this.sendMessage( formatter.swc.LetCursor.apply(this, arguments) );
};

HMI.prototype.swc.LetScroll = function(deltaX, deltaY, velocityX, velocityY, phase, fingerCount) {
	this.sendMessage( formatter.swc.LetScroll.apply(this, arguments) );
};

HMI.prototype.swc.LetTap = function(x, y, fingerCount, clickCount) {
	this.sendMessage( formatter.swc.LetTap.apply(this, arguments) );
};

HMI.prototype.swc.LetRotate = function(deltaAngle, fingerCount) {
	this.sendMessage( formatter.swc.LetRotate.apply(this, arguments) );
};

HMI.prototype.swc.LetZoom = function(deltaZoom, fingerCount) {
	this.sendMessage( formatter.swc.LetZoom.apply(this, arguments) );
};

HMI.prototype.swc.LetGesture = function(gesture) {
	this.sendMessage( formatter.swc.LetGesture.apply(this, arguments) );
};

//// [ TOUCH ] ////////////////////////////////////////////////////////////////

HMI.prototype.touch = {};

HMI.prototype.touch.LetCursor = function(x, y, phase) {
	this.sendMessage( formatter.touch.LetCursor.apply(this, arguments) );
};

HMI.prototype.touch.LetScroll = function(deltaX, deltaY, velocityX, velocityY, phase, fingerCount) {
	this.sendMessage( formatter.touch.LetScroll.apply(this, arguments) );
};

HMI.prototype.touch.LetTap = function(x, y, fingerCount, clickCount) {
	this.sendMessage( formatter.touch.LetTap.apply(this, arguments) );
};

HMI.prototype.touch.LetRotate = function(deltaAngle, fingerCount) {
	this.sendMessage( formatter.touch.LetRotate.apply(this, arguments) );
};

HMI.prototype.touch.LetZoom = function(deltaZoom, fingerCount) {
	this.sendMessage( formatter.touch.LetZoom.apply(this, arguments) );
};

HMI.prototype.touch.LetGesture = function(gesture) {
	this.sendMessage( formatter.touch.LetGesture.apply(this, arguments) );
};

//// [ TRAUMA ] ///////////////////////////////////////////////////////////////

HMI.prototype.GetLevel = function() {
	this.sendMessage( formatter.GetLevel.apply(this, arguments) );
};

HMI.prototype.LetLevel = function(level) {
	this.sendMessage( formatter.LetLevel.apply(this, arguments) );
};

//// [ VEHICLE ] //////////////////////////////////////////////////////////////

HMI.prototype.GetLocked = function() {
	this.sendMessage( formatter.GetLocked.apply(this, arguments) );
};

HMI.prototype.SetLocked = function(locked) {
	this.sendMessage( formatter.SetLocked.apply(this, arguments) );
};

HMI.prototype.LetLocked = function(locked) {
	this.sendMessage( formatter.LetLocked.apply(this, arguments) );
};

HMI.prototype.SetHonk = function(time) {
	this.sendMessage( formatter.SetHonk.apply(this, arguments) );
};

HMI.prototype.LetDriverDoorOpen = function(value) {
	this.sendMessage( formatter.LetDriverDoorOpen.apply(this, arguments) );
};

HMI.prototype.LetStarted = function(value) {
	this.sendMessage( formatter.LetStarted.apply(this, arguments) );
};

HMI.prototype.LetDriverSeated = function(value) {
	this.sendMessage( formatter.LetDriverSeated.apply(this, arguments) );
};

HMI.prototype.LetSpeed = function(value) {
	this.sendMessage( formatter.LetSpeed.apply(this, arguments) );
};

module.exports = HMI;
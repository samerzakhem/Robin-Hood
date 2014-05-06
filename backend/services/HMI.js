var formatter 	= require('./HMIFormatter'),
		socket 			= require('../com/gm/socket')

function HMI(options) {
	this.options = options;

	if(HMI.instance) {
		throw new Error("HMI already instanciated, try HMI.getInstance()")
	} else HMI.instance = this;

	if(this.options.url === undefined)
		throw new Error('HMI expects socketURL')

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
	this.socket.send( message );
};

HMI.prototype.identify = function(name) {
	this.socket.send({
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
	this.socket.send( formatter.SetChime.apply(this, arguments) );
};

//// [ GAZE ] /////////////////////////////////////////////////////////////////
//// [ GPS ] //////////////////////////////////////////////////////////////////

HMI.prototype.LetPosition = function(latitude, longitude) {
	this.socket.send( formatter.LetPosition.apply(this, arguments) );
};

HMI.prototype.SetEndByAddress = function(address) {
	this.socket.send( formatter.SendEndByAddress.apply(this, arguments) );
};

//// [ HEAD ] /////////////////////////////////////////////////////////////////
//// [ LEAP ] /////////////////////////////////////////////////////////////////

HMI.prototype.leap = {};

HMI.prototype.leap.LetCursor = function(x, y, phase) {
	this.socket.send( formatter.leap.LetCursor.apply(this, arguments) );
};

HMI.prototype.leap.LetScroll = function(deltaX, deltaY, velocityX, velocityY, phase, fingerCount) {
	this.socket.send( formatter.leap.LetScroll.apply(this, arguments) );
};

HMI.prototype.leap.LetPoke = function(x, y, fingerCount, clickCount) {
	this.socket.send( formatter.leap.LetPoke.apply(this, arguments) );
};

HMI.prototype.leap.LetRotate = function(deltaAngle, fingerCount) {
	this.socket.send( formatter.leap.LetRotate.apply(this, arguments) );
};

HMI.prototype.leap.LetZoom = function(deltaZoom, fingerCount) {
	this.socket.send( formatter.leap.LetZoom.apply(this, arguments) );
};

HMI.prototype.leap.LetGesture = function(gesture) {
	this.socket.send( formatter.leap.LetGesture.apply(this, arguments) );
};

//// [ NAVIGATION ] ///////////////////////////////////////////////////////////

HMI.prototype.GetWaypoints = function() {
	this.socket.send( formatter.GetWaypoints.apply(this, arguments) );
};

HMI.prototype.SetWaypoints = function(waypoints) {
	this.socket.send( formatter.SetWaypoints.apply(this, arguments) );
};

HMI.prototype.LetWaypoints = function(waypoints) {
	this.socket.send( formatter.LetWaypoints.apply(this, arguments) );
};

//// [ NOTICE ] ///////////////////////////////////////////////////////////////

HMI.prototype.SetAddNotice = function(notice) {
	console.log("SetAddNotice:", formatter.SetAddNotice.apply(this, arguments));
	this.socket.send( formatter.SetAddNotice.apply(this, arguments) );
};

HMI.prototype.GetStatus = function(notice) {
	this.socket.send( formatter.GetStatus.apply(this, arguments) );
};

HMI.prototype.LetStatus = function(count) {
	this.socket.send( formatter.LetStatus.apply(this, arguments) );
};

HMI.prototype.GetNotices = function(start, end) {
	this.socket.send( formatter.GetNotices.apply(this, arguments) );
};

HMI.prototype.LetNotices = function(start, notices) {
	this.socket.send( formatter.LetNotices.apply(this, arguments) );
};

HMI.prototype.SetDeleteNotice = function(id) {
	this.socket.send( formatter.SetDeleteNotice.apply(this, arguments) );
};

//// [ PHONE ] ////////////////////////////////////////////////////////////////

HMI.prototype.GetCharging = function() {
	this.socket.send( formatter.GetCharging.apply(this, arguments) );
};

HMI.prototype.LetCharging = function(charging) {
	this.socket.send( formatter.LetCharging.apply(this, arguments) );
};

HMI.prototype.GetHandsFree = function() {
	this.socket.send( formatter.GetHandsFree.apply(this, arguments) );
};

HMI.prototype.SetHandsFree = function(handsfree) {
	this.socket.send( formatter.SetHandsFree.apply(this, arguments) );
};

HMI.prototype.LetHandsFree = function(handsfree) {
	this.socket.send( formatter.LetHandsFree.apply(this, arguments) );
};

HMI.prototype.SetAction = function(action, number) {
	this.socket.send( formatter.SetAction.apply(this, arguments) );
};

HMI.prototype.GetCallDuration = function() {
	this.socket.send( formatter.GetCallDuration.apply(this, arguments) );
};

HMI.prototype.LetCallDuration = function(duration) {
	this.socket.send( formatter.LetCallDuration.apply(this, arguments) );
};

HMI.prototype.GetStatus = function() {
	this.socket.send( formatter.GetStatus.apply(this, arguments) );
};

HMI.prototype.LetStatus = function(status) {
	this.socket.send( formatter.LetStatus.apply(this, arguments) );
};

HMI.prototype.SetText = function(recipient, text) {
	this.socket.send( formatter.SetText.apply(this, arguments) );
};

//// [ PROXIMITY ] ////////////////////////////////////////////////////////////

HMI.prototype.GetProximity = function() {
	this.socket.send( formatter.GetProximity.apply(this, arguments) );
};

HMI.prototype.LetProximity = function(name, proximity) {
	this.socket.send( formatter.LetProximity.apply(this, arguments) );
};

//// [ SWC ] //////////////////////////////////////////////////////////////////

HMI.prototype.swc = {};

HMI.prototype.swc.LetCursor = function(x, y, phase) {
	this.socket.send( formatter.swc.LetCursor.apply(this, arguments) );
};

HMI.prototype.swc.LetScroll = function(deltaX, deltaY, velocityX, velocityY, phase, fingerCount) {
	this.socket.send( formatter.swc.LetScroll.apply(this, arguments) );
};

HMI.prototype.swc.LetTap = function(x, y, fingerCount, clickCount) {
	this.socket.send( formatter.swc.LetTap.apply(this, arguments) );
};

HMI.prototype.swc.LetRotate = function(deltaAngle, fingerCount) {
	this.socket.send( formatter.swc.LetRotate.apply(this, arguments) );
};

HMI.prototype.swc.LetZoom = function(deltaZoom, fingerCount) {
	this.socket.send( formatter.swc.LetZoom.apply(this, arguments) );
};

HMI.prototype.swc.LetGesture = function(gesture) {
	this.socket.send( formatter.swc.LetGesture.apply(this, arguments) );
};

//// [ TOUCH ] ////////////////////////////////////////////////////////////////

HMI.prototype.touch = {};

HMI.prototype.touch.LetCursor = function(x, y, phase) {
	this.socket.send( formatter.touch.LetCursor.apply(this, arguments) );
};

HMI.prototype.touch.LetScroll = function(deltaX, deltaY, velocityX, velocityY, phase, fingerCount) {
	this.socket.send( formatter.touch.LetScroll.apply(this, arguments) );
};

HMI.prototype.touch.LetTap = function(x, y, fingerCount, clickCount) {
	this.socket.send( formatter.touch.LetTap.apply(this, arguments) );
};

HMI.prototype.touch.LetRotate = function(deltaAngle, fingerCount) {
	this.socket.send( formatter.touch.LetRotate.apply(this, arguments) );
};

HMI.prototype.touch.LetZoom = function(deltaZoom, fingerCount) {
	this.socket.send( formatter.touch.LetZoom.apply(this, arguments) );
};

HMI.prototype.touch.LetGesture = function(gesture) {
	this.socket.send( formatter.touch.LetGesture.apply(this, arguments) );
};

//// [ TRAUMA ] ///////////////////////////////////////////////////////////////

HMI.prototype.GetLevel = function() {
	this.socket.send( formatter.GetLevel.apply(this, arguments) );
};

HMI.prototype.LetLevel = function(level) {
	this.socket.send( formatter.LetLevel.apply(this, arguments) );
};

//// [ VEHICLE ] //////////////////////////////////////////////////////////////

HMI.prototype.GetLocked = function() {
	this.socket.send( formatter.GetLocked.apply(this, arguments) );
};

HMI.prototype.SetLocked = function(locked) {
	this.socket.send( formatter.SetLocked.apply(this, arguments) );
};

HMI.prototype.LetLocked = function(locked) {
	this.socket.send( formatter.LetLocked.apply(this, arguments) );
};

HMI.prototype.SetHonk = function(time) {
	this.socket.send( formatter.SetHonk.apply(this, arguments) );
};

HMI.prototype.LetDriverDoorOpen = function(value) {
	this.socket.send( formatter.LetDriverDoorOpen.apply(this, arguments) );
};

HMI.prototype.LetStarted = function(value) {
	this.socket.send( formatter.LetStarted.apply(this, arguments) );
};

HMI.prototype.LetDriverSeated = function(value) {
	this.socket.send( formatter.LetDriverSeated.apply(this, arguments) );
};

HMI.prototype.LetSpeed = function(value) {
	this.socket.send( formatter.LetSpeed.apply(this, arguments) );
};

module.exports = HMI;
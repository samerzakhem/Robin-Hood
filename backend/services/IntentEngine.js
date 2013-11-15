var needle        = require('needle'),
		socket        = require('../com/gm/socket');

function IntentEngine(options) {
	this.options 		= options;

	if(this.options.socketURL === undefined)
		throw new Error('IntentEngine expects socketURL')

	if(this.options.dataURL === undefined)
		throw new Error('IntentEngine expects dataURL')

	// Initialize the websocket connection
	this.socket = new socket.WebSocket({
		url:        this.options.socketURL,
		onOpen:     function(e) {
			console.log(">> [INTENT] Connected!")
			this.send( options.access_token );
		},
		onClose: 		function() {
			console.log("!! [INTENT] Disconnected!")
		}
	});
}

IntentEngine.prototype.setIgnition = function(state) {
	this.socket.send({
		command: 		"pushIgnitionData",
		timestamp: 	new Date().getTime(),
		params: {
			type: 			(state) ? "IGN_ON" : "IGN_OFF",
			vin:  			this.options.vin,
			location: 	"42.3290,83.0397"
		}
	});
};


IntentEngine.prototype.setUser = function(first, last, dob) {
	needle.post(this.options.dataURL, {
		accesstoken:  this.options.access_token,
		userdata:     {
			firstname:  first,
			lastname:   last,
			dob: 				dob
		}
	}, { json: true }, function(e, res, body) {
		// Response?
	});
};

module.exports = IntentEngine;

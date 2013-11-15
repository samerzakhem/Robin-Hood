var Messaging = (function() {
	var Messaging = function(options) {
		this.options 	= options;
		this.faye 		= new Faye.Client(constants.SOCKET_URL);
	}

	Messaging.prototype.sendMessage = function(from, type, priority, text) {
		this.faye.publish('/messaging', {
			from: 			from,
			type: 			type,
			priority: 	priority,
			text: 			text
		});
	};

	return new Messaging();

})();
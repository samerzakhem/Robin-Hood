var DistanceBroadcaster = (function() {

	var Range = function(broadcaster, options) {
		this.broadcaster 	= broadcaster;

		this.min 					= options.min;
		this.max 					= options.max;

		this._inside 			= undefined;
		
		this.entered 			= options.entered || function() {};
		this.exited 			= options.exited 	|| function() {};

		this.broadcaster.bind('changed', this._onChange.bind(this))
	}

	Range.prototype._onChange = function() {
		var value = this.broadcaster.getValue();

		// Is the value within the range
		if(value < this.max && value >= this.min)
			this._setInside(true);

		// Is the value outside fo the range?
		if(value < this.min || value > this.max)
			this._setInside(false);

	};

	Range.prototype._setInside = function(value) {
		if(value != this._inside) {
			((value) ? this.entered : this.exited ).call(this.broadcaster.scope);
			this._inside = value;
		}
	};

	var DistanceBroadcaster = function(options) {
		this.endpoint 			= options.endpoint;
		this.channel	 			= options.channel;
		this.address 				= options.address;

		this.scope					= options.scope 	|| this;

		this._events 				= {};
		this._value 				= undefined;

		this.faye 					= new Faye.Client(this.endpoint);
		this.faye.subscribe(this.channel, this._onMessage.bind(this));

	}

	DistanceBroadcaster.prototype.bind = function(eventName, callback) {
		var events 			= this._events,
				callbacks 	= events[eventName] = events[eventName] || [];

		callbacks.push(callback)
	};

	DistanceBroadcaster.prototype.fire = function(eventName, args) {
		var callbacks 	= this._events[eventName] || [];
		for(var i = 0, l = callbacks.length ; i < l ; i++)
			callbacks[i].apply(this.scope, args)
	};

	DistanceBroadcaster.prototype.addRange = function(options) {
		return new Range(this, options);
	};

	DistanceBroadcaster.prototype._onMessage = function(msg) {
		if(msg.address == this.address) {
			this.fire('changed', [this._value]);
			this._value = msg.value;
		}
	};

	DistanceBroadcaster.prototype.getValue = function() {
		return this._value;
	};

	DistanceBroadcaster.prototype.getRange = function() {
		return [this.min, this.max];
	};

	return DistanceBroadcaster;

})();
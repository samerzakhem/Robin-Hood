var StatusController = (function() {

	var StatusController = function(options) {
		this.options 	= options;

		if(this.options.element === undefined)
			throw new Error('StatusController expects element')

		// Hook into the UI
		this.element = $('#' + this.options.element);
		this.readouts = {
			locked: 		this.element.find('.locked span'),
			ignition: 	this.element.find('.ignition span'),
			charging: 	this.element.find('.charging span')
		};

		// Listen to when the vehicle values change
		Vehicle.bind('changed', this.onChange.bind(this));
	};

	StatusController.prototype.onChange = function() {

		this.readouts.locked.text( 
			Vehicle.values.locked ? 'Locked' : 'Unlocked' );

		this.readouts.ignition.text( 
			Vehicle.values.ignition ? 'On' : 'Off' );

		this.readouts.charging.text( 
			Vehicle.values.charging ? 'Connected' : 'Disconnected' );
	};

	return StatusController;

})();
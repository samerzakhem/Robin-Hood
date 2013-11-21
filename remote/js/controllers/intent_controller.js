var IntentController = (function() {

	var IntentController = function(options) {
		this.options 	= options;

		if(this.options.element === undefined)
			throw new Error('IntentController expects element')

		// Hook into the UI
		this.element 		= $('#' + this.options.element);
		this.intentButton 	= this.element.find('#intent-btn');
		this.hfpOnButton 	= this.element.find('#hfp-on-btn');
		this.hfpOffButton 	= this.element.find('#hfp-off-btn');

		// Prevent the stupid form from submitting
		this.element.find('form').submit(function(e) {
			e.preventDefault();
		});

		// Listent to a click on the button
		this.intentButton.click(this.onIntentClick)
		this.hfpOnButton.click(this.onHFPOn);
		this.hfpOffButton.click(this.onHFPOff);
	};

	IntentController.prototype.onIntentClick = function(e) {
		e.preventDefault();
		console.log("Simulate intent...");
	};

	IntentController.prototype.onHFPOn = function(e) {
		e.preventDefault();
		Vehicle.setHandsfree(true);
	};

	IntentController.prototype.onHFPOff = function(e) {
		e.preventDefault();
		Vehicle.setHandsfree(false);
	};

	return IntentController;

})();
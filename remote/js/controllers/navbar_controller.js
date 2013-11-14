var NavbarController = (function() {

	var NavbarController = function(options) {
		this.options 	= options;

		if(this.options.element === undefined)
			throw new Error('NavbarController expects element')

		// Hook into the UI
		this.element = $('#' + this.options.element);

		this.element.find('.ignition-on').click(function(e) {
			Vehicle.setIgnition(true);
		});

		this.element.find('.ignition-off').click(function(e) {
			Vehicle.setIgnition(false);
		});

		this.element.find('.unlock').click(function(e) {
			Vehicle.unlock();
		});

		this.element.find('.lock').click(function(e) {
			Vehicle.lock();
		});

	};

	return NavbarController;

})();
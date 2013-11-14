var TraumaController = (function() {

	var TraumaController = function(options) {
		this.options 		= options || {};

		if(this.options.element == undefined)
			throw new Error('TraumaController expects element');

		// Grab the element we're going to manipulate
		this.element 		= $('#' + this.options.element);

		// Set some defaults
		this.options.min 					= options.min	|| 1;
		this.options.max 					= options.max || 3;

		this._initialize();
	}

	TraumaController.prototype._initialize = function() {
		// Create and append the range slider
		this.slider 	= $('<div>').addClass('slider');
		this.element.append(this.slider);

		this.slider.slider({
			min: 					this.options.min,
			max: 					this.options.max,
			orientation: 	'horizontal',
			range: 				'min',
			animate: 			'true',
			slide: 				this._updateLevel.bind(this)
		});

		this.readouts = {
			level: 				$('#' + this.options.element + ' .level')
		};

		this.setLevel();
	};

	TraumaController.prototype._updateLevel = function(event, ui) {
		this.setLevel(ui.value);
	}

	TraumaController.prototype.setLevel = function(value) {
		// Store the value locally and update the display
		this.readouts.level.html( this.value = value || this.options.min );

		// Update the vehicle
		Vehicle.setTraumaLevel(this.value);

	};


	return TraumaController;

})();
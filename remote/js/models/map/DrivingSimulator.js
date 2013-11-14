var DrivingSimulator = (function() {

	/**
	 * GM Driving Simulator
	 *
	 * Uses Google's direction service to dispatch latitude, longitude and other
	 * information to simulate the drive of an actual vehicle
	 *
	 * Depends on:
	 * - jQuery
	 * - v3_epoly (adds GetPOintAtDistance to Polyline)
	 * - Google Maps API
	 * - Greensock TweenLite 
	 */
	var DrivingSimulator = function(options) {

		this.options = options 							|| {};
		this.scope 		= this.options.scope 	|| this;

		// Set up some private variables
		_directionsService 		= new google.maps.DirectionsService(); 			// Set up the google direction service
		_mainTween 						= undefined;																// Reference to main tween
		_speedTween 					= undefined; 																// Reference to speed tween
		
		// Internal init message to set/reset public variables
		_initialize 					= function()
		{
			// Reference to the polyline
			this.pathPolyline 				= new google.maps.Polyline(); 			

			// Current maps.google.LatLng
			this.point 								= new google.maps.LatLng();
			this.lastPoint 						= undefined
			this.threshold 						= this.options.threshold || 150;

			this.instructionSteps 		= []; 	// Array to hold the instructions
			this.latitude 						= 0;		// Latitude in decimal form
			this.longitude 						= 0;		// Longitude in decimal form
			this.distance 						= 0;		// Distance in meters
			this.speed 								= 0;		// Speed in meters per second
			this.heading 							= 0 		// Heading
			this.totalTime						= 0;		// Total time in seconds
			this.currentTime 					= 0;		// Current time in seconds	 				
		}

		// Set up some public variables
		_initialize.call(this);

		// Set up some default callbacks
		this.onReady 							= this.options.onReady 			|| function() {}; 		// Called when we're ready to simulate (directions stored)
		this.onUpdate 						= this.options.onUpdate			|| function() {};			// Called when information changes
		this.onError 							= this.options.onError			|| function() {}; 		// Called when an error occurs
		this.onStart 							= this.options.onStart 			|| function() {}; 		// Called when the simulation starts
		this.onPause 							= this.options.onPause 			|| function() {}; 		// Called when the simulation pauses
		this.onResume 						= this.options.onResume			|| function() {}; 		// Called when the simulation resumes
		this.onReset 							= this.options.onReset 			|| function() {}; 		// Called when the simulation resets
		this.onComplete 					= this.options.onComplete 	|| function() {}; 		// Called when the simulation completes
		this.onDirection 					= this.options.onDirection 	|| function() {}; 		// Called when there's a new direction
	};

	/**
	 * Fetches the routing information from the Google Directions service
	 * 
	 * @param {String} origin
	 * @param {String} destination
	 */
	DrivingSimulator.prototype.setRoute = function(origin, destination) {

		// Ask the directions service for a route between the specified points
		_directionsService.route({
			origin: 			origin,
			destination: 	destination,
			travelMode: 	google.maps.TravelMode.DRIVING
		}, this.onDirectionsReceived.bind(this) );
	};

	/**
	 * Handles the receipt of the directions from Google
	 * 
	 * @param  {Object} result
	 * @param  {String} status
	 */
	DrivingSimulator.prototype.onDirectionsReceived = function(result, status) {
		var self = this;

		// If the result is OK, parse the route
		if(status == google.maps.DirectionsStatus.OK) {
			var route = result.routes[0], stepsHolder = new google.maps.MVCArray();

			// Iterate through each leg of the route
			$.each(route.legs, function(leg_index, leg) {
				// ... And each step in the leg
				$.each(leg.steps, function(step_index, step) {

					// If that step has instructions, store them
					if(step.instructions) {
						self.instructionSteps.push(step)
					}

					// ... And each path in the step
					$.each(step.path, function(path_index, path) {
						// And stuff that information into the MVCArray
						stepsHolder.push( path );
					});
				});
			});

			// Set the path into the polyline
			this.pathPolyline.setPath( stepsHolder );

			// Set the expected distance, time and speed
			this.distance 		= route.legs[0].distance.value;
			this.totalTime		= route.legs[0].duration.value;
			this.speed 				= this.distance / this.totalTime;

			// Alright, singal that we're ready to simulate
			this.onReady.call(this.scope, this);

		// Otherwise, if there was an error
		} else this.onError.call(this.scope, 'An error occurred while retrieving directions.');
	};

	DrivingSimulator.prototype._update = function(callback) {

		this.point 	 		= this.pathPolyline.GetPointAtDistance( this.currentTime * this.speed );
		this.latitude 	= this.point.lat();
		this.longitude 	= this.point.lng();

		// Compute the heading
		if(this.lastPoint) {
			this.heading 		= google.maps.geometry.spherical.computeHeading(this.lastPoint, this.point);
			this.lastPoint 	= this.point;
		}
		
		// Figure out if there are any "turn-by-turn" directions here
		if(this.instructionSteps.length) {
			var point 			= this.instructionSteps[0].start_location,
					distance 		= google.maps.geometry.spherical.computeDistanceBetween(this.point, point);

			if(Math.floor(distance) <= this.threshold) {
				this.onDirection.call(this.scope, this.instructionSteps.shift(), this);
			}
		}

		callback.apply(this.scope);
	};

	/**
	 * Begins the simulation
	 */
	DrivingSimulator.prototype.start = function() {

		_mainTween = TweenLite.to(this, this.totalTime, {
			currentTime: 			this.totalTime,
			ease: 						Linear.easeNone,
			onUpdateScope: 		this,
			onUpdate: 				function() {
				this._update(this.onUpdate);
			},

			onStartScope: 		this,
			onStart: 					function() {
				this._update(this.onStart);
			},
			onCompleteScope: 	this,
			onComplete: 			function() {
				this._update(this.onComplete);
			}
		});
	};

	/**
	 * Pauses the simulation
	 */
	DrivingSimulator.prototype.pause = function() {
		_mainTween.pause();							// Pause the tween
		this.onPause.call(this.scope);	// Trigger the callback
	};

	/**
	 * Resumes the simulation
	 */
	DrivingSimulator.prototype.resume = function() {
		_mainTween.resume();							// Restart the tween
		this.onResume.call(this.scope); 	// Trigger the callback
	};

	/**
	 * Resets the simulation
	 */
	DrivingSimulator.prototype.reset = function() {
		TweenLite.killTweensOf(this); 	// Kill all the tweens
		this.onReset.call(this.scope);	// Trigger the callback
		_initialize.call(this); 				// Reset our variables
		
	}

	return DrivingSimulator;

})();
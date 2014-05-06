var MapController = (function() {

	var MapController = function(options) {
		this.options 		= options;

		if(this.options.element == undefined)
			throw new Error('MapController expects element');

		if(this.options.center == undefined)
			throw new Error('MapController expects center');

		// Initialize the map
		this.map = new google.maps.Map(document.getElementById(this.options.map), {
			center: 		this.options.center,
			zoom: 			13,
			mapTypeId: 	google.maps.MapTypeId.ROADMAP
		});

		// Create a marker on the map to indicate our position
		this.marker = new google.maps.Marker();

		// Configure the driving simulator
		this.simulator = new DrivingSimulator({
			scope: 		this,
			onReady: 	this._onRouteReady,
			onUpdate: 	this._onRouteUpdate
		});

		// Listen to location messages from the HMI for location changes
		HMI.bind('location', 	this._onLocationUpdate.bind(this));

		// Add some elements and listeners
		this.element 			= $('#' + this.options.element);
		this.originField 		= this.element.find('#gps-origin-field');
		this.destinationField 	= this.element.find('#gps-destination-field');
		this.buttons 			= {
			routeButton: 	this.element.find('#gps-route-btn'),
			stopButton: 	this.element.find('#gps-stop-btn'),
			pauseButton: 	this.element.find('#gps-pause-btn'),
			playButton: 	this.element.find('#gps-play-btn')
		}
		
		// Setup some click handlers for the buttons
		this.buttons.routeButton.click(this._onRoute.bind(this));
		this.buttons.stopButton.click(this._onStop.bind(this));
		this.buttons.pauseButton.click(this._onPause.bind(this));
		this.buttons.playButton.click(this._onPlay.bind(this));

		// Stop the form from submitting
		this.element.find('form').submit(function(e) { e.preventDefault(); });
	}

	MapController.prototype._onRoute = function(e) {
		e.preventDefault();
		this.simulator.setRoute(this.originField.val(), this.destinationField.val());
	};

	MapController.prototype._onRouteReady = function() {
		// Set the polyline on the map
		this.simulator.pathPolyline.setMap(this.map);

		// Get our starting point
		var p = this.simulator.pathPolyline.GetPointAtDistance(0);

		// Position and show the marker
		this.marker.setPosition( p )
		this.marker.setMap( this.map );

		// Center the map
		this.map.setCenter( p );

		// Start the simulation
		this.simulator.start();
	};

	MapController.prototype._onRouteUpdate = function() {
		var point = this.simulator.point;

		this.marker.setPosition( point );		// Move the marker
		this.map.setCenter( point );				// Re-center the map

		// Set the vehicle position
		Vehicle.setPosition( point.lat(), point.lng() );
	};

	MapController.prototype._onStop = function() {
		this.simulator.reset();
	};

	MapController.prototype._onPause = function() {
		this.simulator.pause();
	};

	MapController.prototype._onPlay = function() {
		this.simulator.resume();
	};

	MapController.prototype._onLocationUpdate = function(msg) {
		if(this.simulator.point) {
			// Create a string for the lat/lon value
			var point 		= this.simulator.point,
				origin 		= point.lat() + "," + point.lng(),
				// destination = unescape(msg.destination),
				destination	= msg.lat + "," + msg.lon;

			// Update the form field
			this.destinationField.val( destination );
			
			// Update the route
			this.simulator.reset(); 

			// Reroute
			this.simulator.setRoute( origin, destination );
		}
	};

	return MapController;

})();

$(document).ready(function() {

	var mapController = new MapController({
		element: 		'gps-container',
		map: 				'map-canvas',
		center: 		new google.maps.LatLng(41.8354087, -87.8704379)
	});

	var rssiController = new RSSIController({
		element: 		'rssi-container',
		device: 		constants.RSSI_DEVICE
	});

	var traumaController = new TraumaController({
		element: 		'trauma-container'
	});

	var messagingController = new MessagingController({
		element: 		'messaging-container'
	});

	var navbarController = new NavbarController({
		element: 		'nav'
	});

	var statusController = new StatusController({
		element: 		'status-container'
	});

	var intentController = new IntentController({
		element: 		'intent-container'
	});

	if(!/(iPhone|iPad|iPod)\sOS\s6/.test(navigator.userAgent)) {
		var consoleController = new ConsoleController({
			element: 		'console'
		});
	}

	$('#username-container button').click(function(e) {
		e.preventDefault();
		Vehicle.setUser( $('#username-container input').val() );
	});

});
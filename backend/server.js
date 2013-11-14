/**
 * Server.js - Main GM Backend server script
 */

var socket        = require('./com/gm/socket'),
    server        = new socket.Server('/gm', 8000),
    StatusMonitor = require('./services/StatusMonitor'),
    Vehicle       = require('./services/Vehicle'),
    config        = {
      intentEngine: {
        URL:            'ws://smartgrid.asd.novaconcepts.net:9090/EmergingServices/websocket/RobinHoodWS',
        VIN:            '1G1RA6E43CU123168',
        ACCESS_TOKEN:   '5c49870ac65101f32affcf0e0e1d0800'
      },
      nFuzion: {
        url:            'ws://localhost:4412'
      }
    };


// Helpful to debug when things connect, comment out if it gets obnoxious
server.faye.bind('subscribe', function(client, channel) {
  console.log("[%s] subscribed to: %s", client, channel);
});

//// [ INTENT ENGINE ] ////////////////////////////////////////////////////////

// Create a connetion to the intent engine, and send the 
// access token along the first thing after we're connected
var intentSocket = new socket.WebSocket({
  url:        config.intentEngine.URL,
  onOpen:     function(e) {
    console.log(">> [INTENT] Connected!")
    this.send( config.intentEngine.ACCESS_TOKEN );
  }
});

// DEBUG: Listen to any responses from the intent engine
intentSocket.on('message', function(msg) {
  console.log(">> [INTENT]", JSON.stringify(msg));
});

//// [ GPS RELAYS ] ///////////////////////////////////////////////////////////

// Relay the /car/location information to the intent engine every 5 seconds
new socket.Relay({
  to:         intentSocket,
  from:       new socket.FayeChannel({
    url:       server.url,
    channel:  '/car/location'
  }),
  interval:   5,
  translate:      function(message) {
    return {
      command:    'pushLocationData',
      timestamp:  new Date().getTime(),
      params:     {
        vin:        config.intentEngine.VIN,
        location:   message.latitude + "," + message.longitude
      }
    }
  },
});

//// [ CAR STATUS ] ///////////////////////////////////////////////////////////

// Create a monitor that watches car status updates, 
// and triggers change events where appropriate
new StatusMonitor({
  url:      server.url,
  channel:  '/car/status/update'
});

// Listen for when the locked status is changed, 
// and manipulate the Vehicle object as appropriate
new socket.PropertyWatcher({
  url:        server.url,
  channel:    '/car/status',
  property:   'locked',
  onChange:   function(oldValue, newValue) {
    (newValue) ? Vehicle.lock() : Vehicle.unlock();
  }
});

/*
// Relay location data to the HMI websocket
server.addResponder( new socket.RelayResponder({
  channel:    '/car/location',
  url:        config.nFuzion.url,
  onConnect:   function() {
    console.log(">> nfuzion relay connected")
  },

  translate:  function(message) {
    return {
      "gps.LetPosition": {
        latitude:   message.latitude,
        longitude:  message.longitude
      }
    }
  }
}));
*/

/*
// Relay the location data to the intent engine
server.addResponder( new socket.RelayResponder({
  channel:        '/car/location', 
  interval:       5,
  url:            config.intentEngine.URL,
  vin:            config.intentEngine.VIN,
  access_token:   config.intentEngine.ACCESS_TOKEN,

  onConnect:   function() {
    console.log(">> Intent GPS relay is connected")
    this.client.send( this.options.access_token );
  },

  translate:      function(message) {
    return {
      command:    'pushLocationData',
      timestamp:  new Date().getTime(),
      params:     {
        vin:        this.options.vin,
        location:   message.latitude + "," + message.longitude
      }
    }
  },

  wsMessage:  function(e) {
    console.log(">> Intent GOT:", e.data);
  }
}));
*/

// Start the server!
server.start();
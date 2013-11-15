/**
 * Server.js - Main GM Backend server script
 */

var needle        = require('needle'),
    socket        = require('./com/gm/socket'),
    server        = new socket.Server('/gm', 8000),
    Vehicle       = require('./services/Vehicle'),
    IntentEngine  = require('./services/IntentEngine'),
    HMI           = require('./services/HMI'),

    config        = {
      intentEngine: {
        url:            'ws://smartgrid.asd.novaconcepts.net:9090/EmergingServices/websocket/RobinHoodWS',
        VIN:            '1G1RA6E43CU123168',
        ACCESS_TOKEN:   '5c49870ac65101f32affcf0e0e1d0800'
      },
      nFuzion: {
        url:            'ws://localhost:4412'
      },
      userData: {
        url:            'http://smartgrid.asd.novaconcepts.net:9090/EmergingServices/rest/userData'
      }
    };


// Helpful to debug when things connect, comment out if it gets obnoxious
server.faye.bind('subscribe', function(client, channel) {
  console.log("[%s] subscribed to: %s", client, channel);
});

//// [ HMI ] //////////////////////////////////////////////////////////////////
var HMI = new HMI({
  url:    config.nFuzion.url
});

//// [ INTENT ENGINE ] ////////////////////////////////////////////////////////

// Create a connetion to the intent engine, and send the 
// access token along the first thing after we're connected
var IntentEngine = new IntentEngine({
  socketURL:      config.intentEngine.url,
  dataURL:        config.userData.url,
  access_token:   config.intentEngine.ACCESS_TOKEN,
  vin:            config.intentEngine.VIN
});

// DEBUG: Listen to any responses from the intent engine
IntentEngine.socket.on('message', function(msg) {
  console.log(">> [INTENT]", JSON.stringify(msg));
});

//// [ VEHICLE CONFIGURATION ] ////////////////////////////////////////////////

var Vehicle = new Vehicle({
  server:     server,
  vin:        config.intentEngine.VIN
})

//// [ GPS RELAYS ] ///////////////////////////////////////////////////////////

var GPSChannel = new socket.FayeChannel({
  url:        server.url,
  channel:    '/car/location',
  onMessage:  function(msg) {
    // Update the vehicle
    Vehicle.setLocation(msg.latitude, msg.longitude); 

    // Update the HMI
    // TODO: HMI.LetPosition?
    HMI.LetPosition(msg.latitude, msg.longitude);
  }
});

// Relay the /car/location information to the intent engine every 5 seconds
new socket.Relay({
  to:         IntentEngine.socket,
  from:       GPSChannel,
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

new socket.PropertyWatcher({
  url:        server.url,
  channel:    '/car/status',
  property:   'ignition',
  onChange:   function(oldValue, newValue) {
    Vehicle.setIgnition( newValue );        // Update the vehicle
    IntentEngine.setIgnition( newValue );   // Update the intent engine
  }
});

//// [ MISCELLANEOUS ] ////////////////////////////////////////////////////////

// Listen to pushNextDestination commands
// {"timestamp":1384470725966,"category":"NextDestination","data":{"freeTime":false,"nextDestination":{"Name":"Appt2","location":"42.4973839,-83.3756"}},"command":"pushNextDestination"}
new socket.PropertyRecognizer({
  socket:       IntentEngine.socket,
  property:     'command',
  value:        'pushNextDestination',
  onRecognized:  function(msg) {
    console.log("Got destination:", msg.data.nextDestination)
    // TODO: HMI.LetWaypoints? HMI.LetNotices?
  }
});

new socket.PropertyWatcher({
  url:        server.url,
  channel:    '/car/status',
  property:    'user',
  onChange:   function(oldValue, newValue) {
    IntentEngine.setUser(newValue, 'UNUSED', '11152013')
  }
});

new socket.PropertyWatcher({
  url:        server.url,
  channel:    '/car/status',
  property:   'traumaLevel',
  onChange:   function(oldValue, newValue) {
    HMI.LetLevel( newValue );
  }
});

//// [ MESSAGING ] ////////////////////////////////////////////////////////////

new socket.FayeChannel({
  url:       server.url,
  channel:   '/messaging',
  onMessage: function(msg) {
    console.log("Send message:", msg);
    // TODO: HMI.LetNotices?
  }
});


// Start the server!
server.start();
var Socket = {
	VERSION: 		'0.0.1'
}

Socket.Server 									= require('./server.js');

Socket.WebSocket 								= require('./websocket.js');
Socket.FayeChannel 							= require('./faye_channel.js');
Socket.Relay 										= require('./relay.js');

Socket.PropertyWatcher 					= require('./property_watcher.js');
Socket.PropertyRecognizer				= require('./property_recognizer.js')

module.exports = Socket;
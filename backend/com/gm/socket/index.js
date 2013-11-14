var Socket = {
	VERSION: 		'0.0.1'
}

Socket.Server 									= require('./server.js');

Socket.WebSocket 								= require('./websocket.js');
Socket.FayeChannel 							= require('./faye_channel.js');
Socket.Relay 										= require('./relay.js');

Socket.PropertyWatcher 					= require('./property_watcher.js');

module.exports = Socket;
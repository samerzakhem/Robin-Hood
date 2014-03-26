// Include HTTP and faye to setup the server
var http 	= require('http'),
		faye 	= require('faye');

function Server(mount, port) {

	this.mount 		= mount;
	this.port 		= port;
	this.url 			= "ws://localhost:" + this.port + this.mount;

	// Create the http server
	this.server 	= new http.createServer();

	// Create the Faye instance
	this.faye 		= new faye.NodeAdapter( {
		mount: 		mount,
		timeout: 	45
	});

	this.faye.attach(this.server);

}

Server.prototype.start = function() {
	this.server.listen( this.port );		// Start listening on the specified port
}


Server.prototype.addResponder = function(responder) {
	console.log("Adding responder for channel:", responder.channel)
	responder.configure(this)
}


module.exports = Server;
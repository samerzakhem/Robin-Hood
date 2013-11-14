var exec 		= require('child_process').exec;

function Vehicle() {

}

//// [ STATIC ] ///////////////////////////////////////////////////////////////

Vehicle.getInstance = function() {
	if(Vehicle.instance) {
		return Vehicle.instance;
	} else return Vehicle.instance = new Vehicle();
}

//// [ SECURITY ] /////////////////////////////////////////////////////////////

Vehicle.prototype.lock = function() {
	exec('say locking');
	exec("python /Users/onstar/Projects/RH/canbus/lock.py");
};

Vehicle.prototype.unlock = function() {
	exec('say unlocking');
	exec("python /Users/onstar/Projects/RH/canbus/unlock.py");
};

//// [ IGNITION ] /////////////////////////////////////////////////////////////
//// [ CHARGING ] /////////////////////////////////////////////////////////////
//// [ TRAUMA LEVEL ] /////////////////////////////////////////////////////////
//// [ GPS ] //////////////////////////////////////////////////////////////////

module.exports = Vehicle.getInstance();
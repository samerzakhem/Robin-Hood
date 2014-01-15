/* global console, WebSocket, AndroidWebSocket */
/*
 * Javascript object used for communicating with the android application.
 * It exposes two methods for purpose of communication
 *
 * 1) nativeCall - This function allows one to invoke methods on native android
 *                 (Java) objects
 * 2) raiseEvent - This function is used by android applications for invoking
 *                 methods on javascript objects
 */
var WebViewCommunicator = (function() {
    var registered_objects = {};
    /*
     * This method is used by android side of communicator and is
     * not intended to be called from JS code
     */
    function raise_event(object, method, params) {
        object = unescape(object);
        method = unescape(method);
        params = JSON.parse(unescape(params));

        var target_object = registered_objects[object];

        if (!target_object) {
            console.log("WebViewCommunicator: Could not find object '" + target_object + "' called from android");
        } else {
            var target_method = target_object[method];

            if (target_method) {
                target_method.apply(target_object, params);
            } else {
                var err_msg = "WebViewCommunicator: Could not find method '" + target_method + "' " +
                    "on object'" + target_object + "' called from android";
                console.log(err_msg);
            }
        }
    }

    /*
     * This method allows javascript object to expose itself to the android
     * side. Once an object is register the android app can invoke methods on
     * it using the specified 'tag'
     * It throws 'DuplicateTag' exception if any other object is already registered
     * using the specified 'tag'
     *
     * 1) tag:    The identifier that the android objects can use for calling
     *            the method, __self is reserved for internal messaging do NOT use it
     * 2) object: The object that needs to register itself
     */
    function register(tag, object) {
        if (registered_objects[tag]) {
            throw {
                name: "DuplicateTag",
                message: "Another object already registered with tag '" + tag + "'"
            };
        }
        registered_objects[tag] = object;
    }

    /*
     * This method allows the user to call methods on native android
     * objects. It accepts three parameters
     *
     * 1) tag: The 'identifier' the desired android object is registered with during initialization
     *         at the android application side. It is of type string
     * 2) method: The method we wish to invoke on the desired android object. It is of type string
     * 3) The rest of the arguments are interpreted as arguments to be passed to the method when invoking it
     *
     * It returns true if the object with given tag was find else it returns false
     */
    function native_call(tag, method) {
        var params = Array.prototype.slice.call(arguments, 2);
        return _WebViewCommunicator.nativeCall(tag, method, JSON.stringify(params));
    }

    register("__self", {
        log: function(message) {
            console.log(message);
        }
    });

    return ({
        raiseEvent: raise_event,
        nativeCall: native_call,
        register: register
    });
})();

function insertWebSocketShim() {
    function _WebSocket(url) {
        var self = this;

        /* Attributes required by websocket specification */
        this.binaryType = "blob";
        this.bufferedAmount = 0;
        this.extensions = "";
        this.onclose = null;
        this.onerror = null;
        this.onmessage = null;
        this.onopen = null;
        this.protocol = "";
        this.readyState = this.CONNECTING;
        this.url = url;

        /* Register to recieve messages from android application */
        WebViewCommunicator.register("AndroidWebSocket", self);
        WebViewCommunicator.nativeCall("AndroidWebSocket", "connect", url);
    }

    /* Enums for connection state */
    _WebSocket.prototype.CONNECTING = 0;
    _WebSocket.prototype.OPEN = 1;
    _WebSocket.prototype.CLOSING = 2;
    _WebSocket.prototype.CLOSED = 3;


    /* Methods required by specification */
    _WebSocket.prototype.send = function(message) {
        WebViewCommunicator.nativeCall("AndroidWebSocket", "send", message);
    };


    _WebSocket.prototype.close = function() {
        this.readyState = this.CLOSING;
        WebViewCommunicator.nativeCall("AndroidWebSocket", "close");
    };

    // Custom methods used for communication between android and JS side
    _WebSocket.prototype.connect = function() {
        this.readyState = this.OPEN;
        this.onopen();
    };


    _WebSocket.prototype.disconnect = function(code, reason) {
        this.readyState = this.CLOSED;
        this.onclose(code, reason);
    };


    _WebSocket.prototype.error = function() {
        this.onerror();
    };


    _WebSocket.prototype.message = function(message) {
        this.onmessage({
            data: message
        });
    };

    return _WebSocket;
}

// TODO : Checks
//WebSocket = typeof WebSocket === "undefined"? insertWebSocketShim() : WebSocket;

// Force the shim on Android
if (navigator.userAgent.indexOf("Android") >= 0) {
    console.log(">> SHIMMING")
    WebSocket = insertWebSocketShim();
}
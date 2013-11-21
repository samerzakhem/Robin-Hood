import websocket

class LeapWebsocket(object):
    def __init__(self, address, *args):

        # Manage debugging
        websocket.enableTrace(False)

        # Define and connect to the websocket
        self.ws = websocket.WebSocketApp(address,
            on_message  = self.on_message,
            on_error    = self.on_error,
            on_close    = self.on_close,
            on_open     = self.on_open)

    def run_forever(self):
        self.ws.run_forever()

    def on_open(self, ws, message):
        print "Connected..."

    def on_error(self, ws, message):
        print "Error connecting %s" % message

    def on_close(self, ws, message):
        return

    def on_message(self, ws, message):
        print "Message: %s" % message

    def send(self, message):
        self.ws.sock.send(message)
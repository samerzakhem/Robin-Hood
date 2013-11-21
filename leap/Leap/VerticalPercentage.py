from .LeapWebsocket import LeapWebsocket

from numpy import interp
import json

class VerticalPercentage(LeapWebsocket):

    def __init__(self, url, min = None, max = None, fingers = 0, **kwargs):

        self.min        = None
        self.max        = 0

        self._min       = min
        self._max       = max

        self.pos        = None
        self.percent    = 0
        self.callback   = lambda percent: percent

        self.fingers    = fingers

        super(VerticalPercentage, self).__init__(url, **kwargs)

    def on_message(self, ws, message):
        # Decode the websocket JSON
        frame = json.loads(message)

        # If we have hands present in the JSON
        if frame['hands'] and len(frame['pointables']) == self.fingers:

            # Determine the present position of the palm
            self.pos    = frame['hands'][0]['palmPosition'][1]

            # Determine what our minimum and maximum values are
            self.check_bounds()

            # Calculate the percentage
            p = self.calculate_percentage()

            # Callback for when the percentage changes
            if p != self.percent:
                self.set_percent(p)

    def check_bounds(self):
        # Check or define our min and max values
        # If _min is none, then the minimum is the lowest value we've seen
        if self._min is None:
            # If the min hasn't been set yet, set it
            if self.min is None:        self.min = self.pos

            # If it's a lower value, hang on to it
            if self.pos < self.min:     self.min = self.pos
        else: self.min = self._min

        # If _max is none, then the maximum is the highest value we've seen
        if self._max is None:
            if self.pos > self.max:     self.max = self.pos
        else: self.max = self._max

    def calculate_percentage(self):
        return interp(self.pos, [self.min, self.max], [0, 1])

    def set_percent(self, p):
        self.percent = p
        self.callback(p)
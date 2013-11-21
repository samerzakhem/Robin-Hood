from .LeapWebsocket import LeapWebsocket

from numpy import interp
import json

class RotaryPercentage(LeapWebsocket):

    def __init__(self, url, min = 0, max = 100, factor = 1, **kwargs):

        self._min       = min
        self._max       = max
        self.factor     = factor
        
        self.pos        = None
        self.percent    = 0
        self.callback   = lambda percent: percent

        super(RotaryPercentage, self).__init__(url, **kwargs)

    def on_message(self, ws, message):
        # Decode the websocket JSON
        frame = json.loads(message)

        # If we have hands present in the JSON
        if self.check_is_circle(frame): #frame['hands'] and frame['gestures'][0]:

            circle = frame['gestures'][0]

            if circle['state'] == 'update':
                # Has there been a change?
                if self.pos != int(circle['progress']):
                    self.update_percent( (1 if self.is_clockwise( circle['normal'] ) else -1) )
                    self.pos = int(circle['progress'])

    def is_clockwise(self, vector):
        return vector[0] < 0 and vector[1] < 0 and vector[2] < 0

    def check_is_circle(self, frame):
        return frame['hands'] and frame['gestures'][0] and frame['gestures'][0]['type'] == 'circle'

    def update_percent(self, amount):
        self.set_percent( self.percent + (amount * self.factor) )

    def check_bounds(self, p):
        return min(self._max, max(self._min, p))

    def calculate_percentage(self, p):
        return interp(self.check_bounds(p), [self.min, self.max], [0, 1])

    def set_percent(self, p):
        if self.percent != p:
            self.percent = self.calculate_percentage(p)
            self.callback(self.percent)
# https://pypi.python.org/pypi/websocket-client/

from Leap import VerticalPercentage, LeapWebsocket, HMIClient

import sys, argparse
import websocket
import thread

if __name__ == "__main__":

    # Setup the arugment parser
    arg_parser      = argparse.ArgumentParser(description='''

    ''')

    # Add some arguments for min/max
    arg_parser.add_argument('--min',    type=int,   default=None,
                            help='Minimum vertical value (0%%).  If omitted, will auto-sense based on input')

    arg_parser.add_argument('--max',    type=int,   default=None,
                            help='Maximum vertical value (100%%).  If omitted, will auto-sense based on input')

    arg_parser.add_argument('--url',    type=str,   default='ws://localhost:6437',
                            help='The websocket URL: (default: ws://localhost:6437)')

    arg_parser.add_argument('--hmi',    type=str,   default='ws://192.168.0.99:4412',
                            help='The websocket URL for the HMI (default: ws://localhost:4412)')

    arg_parser.add_argument('--fingers', type=int,  default=5, 
                            help='The number of fingers the leap needs to see before allowing a change')
    
    arg_parser.add_argument('--maxVolume', type=float, default=.8,
                            help='The maximum volume value (default: 0.8)')

    # Grab the args
    args = arg_parser.parse_args()

    hmi_socket  = None

    def hmi_thread(args):
        global hmi_socket

        hmi_socket = HMIClient(args.hmi)
        hmi_socket.run_forever()

    def leap_thread(args):
        global hmi_socket

        leap_socket = VerticalPercentage(args.url, args.min, args.max, args.fingers)
        leap_socket.callback = lambda percent: output(args, hmi_socket, percent)
        leap_socket.run_forever()

    def output(args, ws, percent):
        percent = min(percent, args.maxVolume)
        str = "{ \"amp.SetVolume\": { \"value\": %s }}" % percent
        print "Send %s to %s" % (str, ws)
        ws.send(str) 

    try:
        thread.start_new_thread( hmi_thread, (args, ) )
        thread.start_new_thread( leap_thread, (args, ) )
    except:
        print "Unable to start threads..."        

    # Loop forever in our thread, too
    while 1:
        pass
Robin-Hood
==========

Starting the Node backend
-------------------------

Within a terminal window:

    cd /path/to/backend
    node server.js

That's all there is to it.  The backend should attempt to connect to both the HMI as well as the Intent Engine. 

Should the URLs for either the HMI or Intent Engine need to be modified, the configuration options are at the top of the server.js file.

Once the Node backend is up, you can use a browser to navigate to the 'remote' folder.  The host system should have Apache configured, and the URL is typically http://localhost/Robin-Hood/remote/

After visiting the remote, you should see several notifications about client subscriptions to various channels.  This is normal and indicates that the remote should be connected to the backend.

Starting the RSSI proximity script
----------------------------------

This script needs to live on a Raspberry Pi or other similar device and has several dependencies of its own.  Within our current configuration, the Pi should receive the IP address of 192.168.0.5

Within a teriminal window:

		ssh pi@192.168.0.5
		nano -w rssi.py

Ensure that the 'whitelist' variable set includes the bluetooth hardware address for the device(s) you want to track.  Also ensure that the 'socket_url' variable points to the faye endpoint exposed by the node backend - typically http://192.168.0.110:8000/gm.

Once those requirements have been verified, you can exit nano (Ctrl + W) and run the command:

		sudo python rssi.py

RSSI and the Remote Application
-------------------------------

With the RSSI proximity script configured, and the phone discoverable, it should be sending RSSI data across the websocket to the backend.  The backened then distributes this information over a websocket channel.  Therefore, the Remote Application needs to be made aware which bluetooth hardware address to focus on, otherwise the "Bluetooth Distance" section of the remote will be unusable.

To configure the Remote Application, simply navigate to the /path/to/remote and edit the js/constants.js file.  The RSSI_DEVICE constant should be modified to reflect the hardware address of the phone.

You'll know this is working when the red line within the slider control fluctuates with the physical distance of the phone from the Raspberry Pi running the RSSI proximity script.  The handles of the slider control are used to modify the bounds of the "approaching" and "arrived" ranges and should be used to fine-tune these ranges for demonstration.

Starting the Leap Volume sensor
-------------------------------

Within a terminal window:

    cd /path/to/leap
    python volume.py --help

Take note of the configuration arguments for this script.  It's designed to map the vertical range of a number of fingers to a value between 0 and 0.8 (default value for maxVolume).

The --url flag should point to the websocket URL expoed by the Leap software itself.  The --hmi flag is designed to point at the Span server provided by nfuzion, and will typically be the located on port 4412 of localhost.

In the absence of --min or --max values, the script will auto-sense the minimum and maximum range as defined by the user. 

Exceute the script by calling:

		python volume.py 

And pass in whichever configuration variables make the most sense for your use case.
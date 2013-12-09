ROBIN HOOD RELEASE NOTES - 2013-12-06


CONTENTS
--------
The contents of this release are split across the following folders:
 - cluster - contains the left-hand display application.
 - docs - contains the most recent version of several system level documents.
 - graphics - contains the latest Photoshop PSDs used to create the cluster and
   HMI.
 - hmi - contains the latest right-hand display application.
 - library - contains the latest message spec.
 - messageSender - contains an HTML5 app for sending test messages to the HMI 
   and cluster.
 - nSpan.air - is the span server responsible for system messaging.
 - nService.air - is the simulated services application.

   
AMP AND BT HANDS-FREE
---------------------
In addition to the above, the BT hands-free functionality was delivered in the
form of a Raspberry Pi on an nfuzion nAmp1.  The necessary service
(rhAmpBridge), responsible for connecting the amp to the span network was
preinstalled on the Raspberry Pi, and automatically starts on boot.  


SETUP
-----
The following steps outline the configuration of these tools and applications.
The audience is assumed to be a technical person already familiar with the
Robin Hood project, Mac OS, and Raspberry Pi, etc.:

  1) If not already installed, download and install Adobe AIR on the Mac Mini.
  2) Install and run nSpan.air and nService.air an the Mac Mini.  (Additional
     configuration of nService is not covered here.)
  3) Determine the IP address of the Mac Mini and modify the /etc/hosts file
     so that "spanhost" points to it.
  3) Edit the /etc/hosts file on the Raspberry Pi so that "spanhost" points to
     the Mac Mini.
  4) Restart the Raspberry Pi and verify that rhAmpBridge appears as a client
     in nSpan.
  5) Load cluster/js/index.html and hmi/js/index.html into separate windows of
     Safari on the Mac Mini.  Verify that "HMI" and "Cluster" appear as clients
     in nSpan.
  6) Load messageSender/js/index.html into a browser window and click "Robin
     Hood HMI," then "Welcome" to kick off the welcome sequence and start the
     system.  Use other messages to test the HMI.

#!/usr/bin/python
#==========================================================================
# (c) 2011  Total Phase, Inc.
#--------------------------------------------------------------------------
# Project : Komodo Examples
# File    : detect.py
#--------------------------------------------------------------------------
# Simple Komodo device detection example.
#--------------------------------------------------------------------------
# Redistribution and use of this file in source and binary forms, with
# or without modification, are permitted.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
# FOR A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE
# COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
# INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
# BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
# CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
# LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
# ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
# POSSIBILITY OF SUCH DAMAGE.
#========================================================================*/

#==========================================================================
# IMPORTS
#========================================================================*/
from komodo_py import *


#==========================================================================
# MAIN PROGRAM
#==========================================================================
print 'Searching for Komodo Interfaces...\n'

(num, ports, unique_ids) = km_find_devices_ext(16, 16)

if num > 0:
    print "%d ports(s) found:" % num
    # Print the information on each device
    for i in range(num):
        port      = ports[i]
        unique_id = unique_ids[i]

        # Determine if the device is in-use
        inuse = "(avail)"
        if (port & KM_PORT_NOT_FREE):
            inuse = "(in-use)"
            port  = port & ~KM_PORT_NOT_FREE

        # Display device port number, in-use status, and serial number
        # Note that each Komodo has 2 ports
        print "    port = %d   %s  (%04d-%06d)" % \
            (port, inuse, unique_id / 1000000, unique_id % 1000000)

else:
    print "No devices found."

print

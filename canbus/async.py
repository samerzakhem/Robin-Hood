#!/usr/bin/python
#==========================================================================
# (c) 2011  Total Phase, Inc.
#--------------------------------------------------------------------------
# Project : Komodo Examples
# File    : async.py
#--------------------------------------------------------------------------
# Uses the asynchronous interface of the Komodo CAN Duo.
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

#=========================================================================
# FUNCTIONS
#=========================================================================
def print_usage ():
    print \
"""
Usage: async PORT TARGET_PWR CAN_ID ITER

This utility uses the asynchronous interface to send packets on CAN A.

  PORT       : Komodo port
  TARGET_PWR : 1 turns on target power, 0 does not
  CAN_ID     : Packets are broadcast with this ID
  ITER       : Number of packets to process asynchronously

For product documentation and specifications, see www.totalphase.com.
"""

def async (km, can_id, can_ch, iterate):
    arb_count = 0
    timeout   = 500
    data      = array('B', [1, 2, 3, 4, 5, 6, 7, 8])
    data      = array('B', [0x00, 0x01, 0x00])
    
    pkt       = km_can_packet_t()
    pkt.dlc   = len(data)
    pkt.id    = can_id

    # Enable Komodo
    ret = km_enable(km)
    if (ret != KM_OK):
        print 'Unable to enable Komodo'
        return

    # Send first packet
    km_can_async_submit(km, can_ch, 0, pkt, data);
    print 'Submitted packet 1'

    for i in range(iterate - 1):
        # Send another packet while the first is still in progress
        km_can_async_submit(km, can_ch, 0, pkt, data);
        print 'Submitted packet %d' % (i + 2)

        # The application can now perform other functions
        # while the Komodo is sending the previous packet
        km_sleep_ms(100);

        # Collect response to previously submitted packet
        (ret, arb_count) = km_can_async_collect(km, timeout);

        if (ret == KM_OK):
            print 'Collected packet %d' % (i + 1)
        else:
            print 'Error %d' % ret

    # Collect the last response
    (ret, arb_count) = km_can_async_collect(km, timeout);
    if (ret == KM_OK):
        print 'Collected packet %d\n' % (iterate)
    else:
        print 'Error %d\n' % ret


#==========================================================================
# MAIN PROGRAM
#==========================================================================
bitrate = 125000
bitrate = 33333

if len(sys.argv) < 5:
    print_usage()
    sys.exit(1)

port    = int(sys.argv[1])
power   = KM_TARGET_POWER_ON if int(sys.argv[2]) else KM_TARGET_POWER_OFF
can_id  = int(sys.argv[3], 0)
iterate = int(sys.argv[4])

# Open the interface
km = km_open(port)
if km <= 0:
    print 'Unable to open Komodo on port %d' % port
    print 'Error code = %d' % km
    sys.exit(1)

# Acquire features
ret = km_acquire(km, KM_FEATURE_CAN_A_CONFIG | KM_FEATURE_CAN_A_CONTROL)
print 'Acquired features', hex(ret)

# Set bitrate
ret = km_can_bitrate(km, KM_CAN_CH_A, bitrate);
print 'Bitrate set to %d kHz' % (ret/1000)

# Set target power
km_can_target_power(km, KM_CAN_CH_A, power);
print 'Target power %s' %('ON' if power else 'OFF')
print

async(km, can_id, KM_CAN_CH_A, iterate);

# Close and exit
km_close(km)
sys.exit(0)

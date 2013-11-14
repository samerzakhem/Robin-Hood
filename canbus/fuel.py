#!/usr/bin/python
#==========================================================================
# (c) 2011  Total Phase, Inc.
#--------------------------------------------------------------------------
# Project : Komodo Examples
# File    : request.py
#--------------------------------------------------------------------------
# Request data from specified CAN ID and print received data.
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
# IMPORTS and CONSTANTS
#========================================================================*/
from komodo_py import *

MAX_PKT_SIZE = 8


#=========================================================================
# FUNCTIONS
#=========================================================================
def print_usage ():
    print \
"""
Usage: request PORT TARGET_PWR CAN_ID

Example utility which requests data from provided CAN ID on CAN A.

  PORT: Komodo port
  TARGET_PWR: 1 turns on target power, 0 does not
  CAN_ID: ID to request CAN packet from

For product documentation and specifications, see www.totalphase.com.
"""

def print_num_array (array, data_len):
    print '[',
    for i in range(data_len):
        print array[i],
    print ']'

def request (km, can_id, ch):
    data = array('B', '\0'*MAX_PKT_SIZE)
    info = km_can_info_t()

    pkt            = km_can_packet_t()
    pkt.dlc        = MAX_PKT_SIZE
    pkt.id         = can_id
    pkt.remote_req = 1

    # Enable Komodo
    ret = km_enable(km)
    if ret != KM_OK:
        print 'Unable to enable Komodo'
        return

    #print
   # print 'Request data from CAN ID %d (0x%x)' % (can_id, can_id)

    # Send a remote frame with no data. Data array is not important.
    km_can_write(km, ch, 0, pkt, data)

    pkt.id = -1

    # Look for packet with desired CAN ID. Store in data[].
    while (pkt.id != can_id):
        (ret, info, pkt, data) = km_can_read(km, data)

        if info.status & KM_READ_TIMEOUT:
            print 'Timeout: no data!'
            print
            return

    #print 'Received %d byte(s):' % ret,

    #print_num_array(data, ret)
    #print
    
    fuelhex = hex(data[0]).lstrip("0x")+hex(data[1]).lstrip("0x")+hex(data[2]).lstrip("0x")+hex(data[3]).lstrip("0x")+hex(data[4]).lstrip("0x")+hex(data[5]).lstrip("0x")
    print fuelhex     
    #print int(odohex, 16)

    fueldec = int(fuelhex,16)
   # print ododec

    fuel = fueldec * 0.392157
   # print odokm

    #odomiles = odokm * 0.621371
    #print 'odometer is %d miles' % odomiles
    print '%d' % fuel




#==========================================================================
# MAIN PROGRAM
#==========================================================================
bitrate = 125000 # kHz
bitrate = 33333   # 33.33
timeout = 3000   # ms

#if len(sys.argv) < 4:
 #   print_usage()
  #  sys.exit(1)

#port   = int(sys.argv[1])
#power  = KM_TARGET_POWER_ON if int(sys.argv[2]) else KM_TARGET_POWER_OFF
#can_id = int(sys.argv[3], 0)

port   = 0            #int(sys.argv[1])
power  = 1            #KM_TARGET_POWER_ON if int(sys.argv[2]) else KM_TARGET_POWER_OFF
can_id = 0x10800040

# Open the interface
km = km_open(port)
if km <= 0:                       
    print 'Unable to open Komodo on port %d' % port
    print 'Error code = %d' % km
    sys.exit(1)

# Acquire features to control and listen CAN A
ret = km_acquire(km, KM_FEATURE_CAN_A_CONFIG  |
                     KM_FEATURE_CAN_A_CONTROL |
                     KM_FEATURE_CAN_A_LISTEN)
#print 'Acquired features: 0x%x' % ret

# Set bitrate
ret = km_can_bitrate(km, KM_CAN_CH_A, bitrate)
#print 'Bitrate set to %d kHz' % (ret/1000)

# Set timeout
km_timeout(km, timeout)
#print 'Timeout set to %d ms' % timeout

# Set target power
km_can_target_power(km, KM_CAN_CH_A, power)
#print 'Target power %s' % ('ON' if power else 'OFF')

request(km, can_id, KM_CAN_CH_A)

# Close and exit
km_close(km)
sys.exit(0)

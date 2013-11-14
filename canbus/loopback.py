#!/usr/bin/python
#==========================================================================
# (c) 2011  Total Phase, Inc.
#--------------------------------------------------------------------------
# Project : Komodo Examples
# File    : loopback.py
#--------------------------------------------------------------------------
# Demonstrates how to open ports, acquire features, write and read data.
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
Usage: loopback PORT1 PORT2

Example utility showing how to read and write CAN data.
CAN channels A and B must be connected with a terminated cable.
PORT1 and PORT2 may be the same or different.

  PORT1: Komodo port that connects to CAN channel A
  PORT2: Komodo port that connects to CAN channel B

For product documentation and specifications, see www.totalphase.com.
"""

def print_num_array (array):
    print '[',
    for i in range(len(array)):
        print i,
    print ']'


def loopback (kma, kmb):
    can_id    = 0xFF
    info      = km_can_info_t()
    data_out  = array('B', [1, 2, 3, 4, 5, 6, 7, 8])
    data_in   = array('B', '\0'*len(data_out))

    pkt       = km_can_packet_t()
    pkt.dlc   = len(data_out)
    pkt.id    = can_id

    # Enable CAN A and B
    ret = km_enable(kma)
    if ret != KM_OK:
        print 'Unable to enable Komodo A'
        return

    if kma != kmb:
        ret = km_enable(kmb)
        if ret != KM_OK:
            print 'Unable to enable Komodo B'
            return

    # Send data on CAN A
    km_can_write(kma, KM_CAN_CH_A, 0, pkt, data_out)

    print
    print 'Sent data:    ',
    print_num_array(data_out)

    # Read data on CAN B
    ret = 0
    while(ret == 0):
        (ret, info, pkt, data_in) = km_can_read(kmb, data_in)

    print 'Received data:',
    print_num_array(data_in)

    # Verify received data
    print 'Verifying data... %s' % ('PASS' if data_in == data_out else 'FAIL')
    print


#==========================================================================
# MAIN PROGRAM
#==========================================================================
timeout = 1000   # ms
bitrate = 125000 # Hz
bitrate = 33333  # kHz

if len(sys.argv) < 3:
    print_usage()
    sys.exit(1)

porta = int(sys.argv[1])
portb = int(sys.argv[2])

# Connect to and configure
kma = km_open(porta)
if kma <= 0:
    print 'Unable to open Komodo on port %d' % porta
    print 'Error code = %d' % kma
    sys.exit(1)

if porta != portb:
    kmb = km_open(portb)
    if kmb <= 0:
        print 'Unable to open Komodo on port %d' % portb
        print 'Error code = %d' % kmb
        sys.exit(1)
else: kmb = kma

# Setup CAN channel A for writing and B for listening
reta = km_acquire(kma, KM_FEATURE_CAN_A_CONFIG  |
                       KM_FEATURE_CAN_A_CONTROL)
retb = km_acquire(kmb, KM_FEATURE_CAN_B_CONFIG  |
                       KM_FEATURE_CAN_B_CONTROL |
                       KM_FEATURE_CAN_B_LISTEN)
print 'Features for CAN A: 0x%x, CAN B: 0x%x' % (reta, retb)

# Set bitrate
reta = km_can_bitrate(kma, KM_CAN_CH_A, bitrate)
retb = km_can_bitrate(kmb, KM_CAN_CH_B, bitrate)
print 'Bitrate for CAN A set to %d kHz, CAN B set to %d kHz' % (reta/1000,
                                                                retb/1000)
# Set timeout
km_timeout(kmb, timeout)
print 'Timeout for CAN B set to %d ms' % timeout

# Set target power
km_can_target_power(kma, KM_CAN_CH_A, KM_TARGET_POWER_ON)
km_can_target_power(kmb, KM_CAN_CH_B, KM_TARGET_POWER_OFF)
print 'Enabled target power for CAN A and disabled for CAN B'

loopback(kma, kmb)

# Close and exit
km_close(kma)
km_close(kmb)
sys.exit(0)

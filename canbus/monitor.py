#!/usr/bin/python
#==========================================================================
# (c) 2011  Total Phase, Inc.
#--------------------------------------------------------------------------
# Project : Komodo Examples
# File    : monitor.py
#--------------------------------------------------------------------------
# Simple program that monitors CAN bus and GPIO activity.
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

import sys

MAX_PKT_SIZE = 8
NUM_GPIOS    = 8


#=========================================================================
# FUNCTIONS
#=========================================================================
def print_usage ():
    print \
"""
Usage: monitor TARGET_PWR NUM_EVENTS

Example utility for capturing CAN and GPIO activity on CAN A.

  TARGET_PWR: 1 turns on target power, 0 does not
  NUM_EVENTS: Number of events to process before exiting.  If this is
              set to zero, the capture will continue indefinitely

For product documentation and specifications, see www.totalphase.com.
"""

def timestamp_to_ns (stamp, samplerate_khz):
    return (stamp * 1000 / (samplerate_khz/1000))

def print_num_array (array, data_len):
    for i in range(data_len):
        print array[i],

def print_status (status):
    if status == KM_OK:                 print 'OK',
    if status & KM_READ_TIMEOUT:        print 'TIMEOUT',
    if status & KM_READ_ERR_OVERFLOW:   print 'OVERFLOW',
    if status & KM_READ_END_OF_CAPTURE: print 'END OF CAPTURE',
    if status & KM_READ_CAN_ARB_LOST:   print 'ARBITRATION LOST',
    if status & KM_READ_CAN_ERR:        print 'ERROR %x' % (status &
                                                KM_READ_CAN_ERR_FULL_MASK),

def print_events (events, bitrate):
    if events == 0:
        return
    if events & KM_EVENT_DIGITAL_INPUT:
        print 'GPIO CHANGE 0x%x;' % (events & KM_EVENT_DIGITAL_INPUT_MASK),
    if events & KM_EVENT_CAN_BUS_STATE_LISTEN_ONLY:
        print 'BUS STATE LISTEN ONLY;',
    if events & KM_EVENT_CAN_BUS_STATE_CONTROL:
        print 'BUS STATE CONTROL;',
    if events & KM_EVENT_CAN_BUS_STATE_WARNING:
        print 'BUS STATE WARNING;',
    if events & KM_EVENT_CAN_BUS_STATE_ACTIVE:
        print 'BUS STATE ACTIVE;',
    if events & KM_EVENT_CAN_BUS_STATE_PASSIVE:
        print 'BUS STATE PASSIVE;',
    if events & KM_EVENT_CAN_BUS_STATE_OFF:
        print 'BUS STATE OFF;',
    if events & KM_EVENT_CAN_BUS_BITRATE:
        print 'BITRATE %d kHz;' % (bitrate/1000),

# The main packet dump routine
def candump (km, max_events):
    info = km_can_info_t()
    pkt  = km_can_packet_t()
    data = array('B', '\0'*MAX_PKT_SIZE)

    # Get samplerate
    samplerate_khz = km_get_samplerate(km)/1000

    # Enable Komodo
    ret = km_enable(km)
    if ret != KM_OK:
        print 'Unable to enable Komodo'
        return

    # Print description of csv output
    print
    print 'index,time(ns),(status & events),<ID:rtr/data> hex data'
    print

    # Start monitoring
    count = 0
    while ((max_events == 0) or (count < max_events)):
        (ret, info, pkt, data) = km_can_read(km, data)

	print '%d,%d,(' % (count, timestamp_to_ns(info.timestamp,
                                                  samplerate_khz)),
	if ret < 0:
	  print 'error=%d)' % ret
          continue

	print_status(info.status)
        print_events(info.events, info.bitrate_hz)

        # Continue printing if we didn't see timeout, error or dataless events
        if ((info.status == KM_OK) and not info.events):
            print '),<%x:%s' % (pkt.id,
                                'rtr>' if pkt.remote_req else 'data>'),

            # If packet contained data, print it
            if not pkt.remote_req:
                print_num_array(data, ret)
        else:
            print ')',

        print
        sys.stdout.flush()
        count += 1


#==========================================================================
# MAIN PROGRAM
#==========================================================================
port    = 0      # Use port 0
timeout = 1000   # ms
bitrate = 125000 # Hz
bitrate = 33333  # kHz
if len(sys.argv) < 3:
    print_usage()
    sys.exit(1)

power      = KM_TARGET_POWER_ON if int(sys.argv[1]) else KM_TARGET_POWER_OFF
max_events = int(sys.argv[2])

# Open the interface
km = km_open(port)
if km <= 0:
    print 'Unable to open Komodo on port %d' % port
    print 'Error code = %d' % km
    sys.exit(1)

# Acquire features.  Acquiring KM_FEATURE_CAN_A_CONTROL causes the Komodo
# interface to ACK all packets transmitted on the bus.  Remove this feature to
# prevent the device from transmitting anything on the bus.
ret = km_acquire(km, KM_FEATURE_CAN_A_CONFIG  |
                     KM_FEATURE_CAN_A_LISTEN  |
                     KM_FEATURE_CAN_A_CONTROL |
                     KM_FEATURE_GPIO_CONFIG   |
                     KM_FEATURE_GPIO_LISTEN)
print 'Acquired features 0x%x' % ret

# Set bitrate
ret = km_can_bitrate(km, KM_CAN_CH_A, bitrate)
print 'Bitrate set to %d kHz' % (ret/1000)

# Set timeout
km_timeout(km, timeout)
print 'Timeout set to %d ms' % timeout

# Set target power
km_can_target_power(km, KM_CAN_CH_A, power)
print 'Target power %s' % ('ON' if power else 'OFF')

# Configure all GPIO pins as inputs
for i in range (NUM_GPIOS):
    km_gpio_config_in(km, i, KM_PIN_BIAS_PULLUP, KM_PIN_TRIGGER_BOTH_EDGES)
print 'All pins set as inputs'

candump(km, max_events)
print

# Close and exit
km_close(km)
sys.exit(0)

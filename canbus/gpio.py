#!/usr/bin/python
#==========================================================================
# (c) 2011  Total Phase, Inc.
#--------------------------------------------------------------------------
# Project : Komodo Examples
# File    : gpio.py
#--------------------------------------------------------------------------
# Performs some simple GPIO operations with a Komodo interface.
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

import time

PIN0      = 0
PIN1      = 1
NUM_GPIOS = 8


#=========================================================================
# FUNCTIONS
#=========================================================================
def print_usage ():
    print \
"""
Usage: gpio PORT

Example utility that demonstrates GPIO functions of the Komodo CAN Duo.

  PORT: Komodo port

For product documentation and specifications, see www.totalphase.com.
"""

def show_pin_state (state, pin):
    mask = (1 << (pin - 1))
    print 'Pin %d is %s' % (pin, 'high' if state & mask else 'low')

def monitor_changes (km):
    wait_sec = 20;

    print '\nConfigure pins as inputs with pullups'
    for i in range(NUM_GPIOS):
        km_gpio_config_in(km, i, KM_PIN_BIAS_PULLUP, KM_PIN_TRIGGER_NONE);

    # Enable Komodo
    km_enable(km);
    print 'Monitoring GPIO pin changes for %d seconds:\n' % wait_sec

    endtime = time.time() + wait_sec
    oldval  = km_gpio_get(km)

    while (time.time() < endtime):
        # Check for pin changes
        newval = km_gpio_get(km);
        if newval != oldval:
            change = oldval ^ newval;

            # Display the pins that changed
            for i in range(NUM_GPIOS):
                if change & (1 << i):
                    show_pin_state(newval, i + 1)

            # Save the current state
            oldval = newval
    print

def gpio (km):
    print 'Configuring Pin 1 as an output'
    km_gpio_config_out(km, KM_GPIO_PIN_1_CONFIG, KM_PIN_DRIVE_NORMAL,
                       KM_PIN_SRC_SOFTWARE_CTL)

    print 'Configuring Pin 2 as an input with pullup'
    km_gpio_config_in(km, KM_GPIO_PIN_2_CONFIG, KM_PIN_BIAS_PULLUP,
                      KM_PIN_TRIGGER_NONE)

    # Enable Komodo
    km_enable(km)

    print '\nSetting Pin 1 to logic low'
    km_gpio_set(km, 0, KM_GPIO_PIN_1_MASK)

    # Show the state of each pin
    # Pin 1 should be low because we just set it low.
    # Pin 2 should be high because it's an input with a pullup resistor.
    ret = km_gpio_get(km)
    show_pin_state(ret, 1)
    show_pin_state(ret, 2)

    # Disable the Komodo interface to change the GPIO configuration
    km_disable(km)

    print '\nConfiguring Pin 2 as an input with pulldown'
    km_gpio_config_in(km, KM_GPIO_PIN_2_CONFIG, KM_PIN_BIAS_PULLDOWN,
                      KM_PIN_TRIGGER_NONE)

    # Enable and read value of PIN 2
    km_enable(km)
    ret = km_gpio_get(km)
    show_pin_state(ret, 2)

    km_disable(km)

    # Now, set all GPIOs as inputs and monitor for changes
    monitor_changes(km)


#==========================================================================
# MAIN PROGRAM
#==========================================================================
if len(sys.argv) < 2:
    print_usage()
    sys.exit(1)

port = int(sys.argv[1])

# Open the interface
km = km_open(port)
if km <= 0:
    print 'Unable to open Komodo on port %d' % port
    print 'Error code = %d' % km
    sys.exit(1)

# Acquire features
ret = km_acquire(km, KM_FEATURE_GPIO_LISTEN  |
                     KM_FEATURE_GPIO_CONTROL |
                     KM_FEATURE_GPIO_CONFIG)
print 'Acquired features 0x%x' % ret

gpio(km)

# Close and exit
km_close(km)
sys.exit(0)

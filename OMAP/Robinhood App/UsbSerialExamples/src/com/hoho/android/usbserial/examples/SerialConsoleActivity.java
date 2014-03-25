/* Copyright 2011 Google Inc.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301,
 * USA.
 *
 * Project home page: http://code.google.com/p/usb-serial-for-android/
 */

package com.hoho.android.usbserial.examples;

import org.json.JSONException;
import org.json.JSONObject;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Button;
import android.view.View;
import android.view.View.OnClickListener;


import com.hoho.android.usbserial.driver.UsbSerialDriver;
import com.hoho.android.usbserial.examples.SteeringClient.SteeringGestures;
import com.hoho.android.usbserial.examples.SteeringClient.SteeringPhase;
import com.hoho.android.usbserial.examples.TouchClient;
import com.hoho.android.usbserial.examples.TouchClient.TouchGestures;
import com.hoho.android.usbserial.examples.TouchClient.TouchPhase;
import com.hoho.android.usbserial.util.HexDump;
import com.hoho.android.usbserial.util.SerialInputOutputManager;

import java.io.IOException;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;




/**
 * Monitors a single {@link UsbSerialDriver} instance, showing all data
 * received.
 *
 * @author mike wakerly (opensource@hoho.com)
 * @param <MyCount>
 */
public class SerialConsoleActivity<MyCount> extends Activity {
    private TouchClient touchClient;
    private SteeringClient steeringClient;
    private final String TAG = SerialConsoleActivity.class.getSimpleName();

    /**
     * Driver instance, passed in statically via
     * {@link #show(Context, UsbSerialDriver)}.
     *
     * <p/>
     * This is a devious hack; it'd be cleaner to re-create the driver using
     * arguments passed in with the {@link #startActivity(Intent)} intent. We
     * can get away with it because both activities will run in the same
     * process, and this is a simple demo.
     */
    private static UsbSerialDriver sDriver = null;
    private static UsbSerialDriver sDriver2 = null;
    private static byte Button1Prev = 0x1F;
    private static byte Button2Prev = 0x0F;
    
    private TextView mTitleTextView;
    private TextView mDumpTextView;
    private ScrollView mScrollView;

    private final ExecutorService mExecutor = Executors.newSingleThreadExecutor();
    private final ExecutorService mExecutor2 = Executors.newSingleThreadExecutor();
    
    private SerialInputOutputManager mSerialIoManager;
    private SerialInputOutputManager mSerialIoManager2;

    private Timer timer;
    Handler myHandler = new Handler();    
    Handler myHandlerSt = new Handler();    
    
    private float TouchX;
    private float TouchY;
    
    private float SteeringX;
    private float SteeringY;
    
    private int SteeringFlag = 0;
    private int TouchFlag = 0;
    
    private SteeringPhase StPhaseState = SteeringPhase.start;
    private TouchPhase ToPhaseState = TouchPhase.start;
    
   
    
    
    private final SerialInputOutputManager.Listener mListener =
            new SerialInputOutputManager.Listener() {

        @Override
        public void onRunError(Exception e) {
            Log.d(TAG, "Runner stopped.");
            
        }

        @Override
        public void onNewData(final byte[] data) {
            SerialConsoleActivity.this.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    SerialConsoleActivity.this.updateReceivedData(data);
                }
            });
        }
    };

    private final SerialInputOutputManager.Listener mListener2 =
            new SerialInputOutputManager.Listener() {

        @Override
        public void onRunError(Exception e) {
            Log.d(TAG, "Runner stopped.");
        }

        @Override
        public void onNewData(final byte[] data) {
            SerialConsoleActivity.this.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    SerialConsoleActivity.this.updateReceivedData(data);
                }
            });
        }
    };    

    
    private TimerTask UpdateTimeTask = new TimerTask()
    {
        @Override
        public void run() {
            // TODO Auto-generated method stub
//            mDumpTextView.append("Timer Expired\n");

            if(SteeringFlag == 1)
            {
                // Timer expired so this is the last data packet
                StPhaseState = SteeringPhase.end;
                steeringClient.LetCursor(TouchX, TouchY, StPhaseState);
                StPhaseState = SteeringPhase.start;
                
                SteeringFlag = 0;
            }
            else if(TouchFlag == 1)
            {
                // Timer expired so this is the last data packet
                ToPhaseState = TouchPhase.end;
                touchClient.LetCursor(TouchX, TouchY, ToPhaseState);
                ToPhaseState = TouchPhase.start;
                
                TouchFlag = 0;
            }
        }
        
    };
    
    private TimerTask SteeringUpdateTimeTask = new TimerTask()
    {
        @Override
        public void run() {
            // TODO Auto-generated method stub
 //           mDumpTextView.append("Timer Expired\n");

            // Timer expired so this is the last data packet
            StPhaseState = SteeringPhase.end;
            steeringClient.LetCursor(TouchX, TouchY, StPhaseState);
            StPhaseState = SteeringPhase.start;
            
            SteeringFlag = 0;

        }
        
    };
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
                
        super.onCreate(savedInstanceState);
        setContentView(R.layout.serial_console);
        mTitleTextView = (TextView) findViewById(R.id.demoTitle);
//        mDumpTextView = (TextView) findViewById(R.id.consoleText);
        mScrollView = (ScrollView) findViewById(R.id.demoScroller);
        
        timer = new Timer();
        
        Button button1 = (Button)findViewById(R.id.button1);
        button1.setOnClickListener(startListener);
        
        
//        touchClient = new TouchClient("ws://192.168.0.109:4412");
        touchClient = new TouchClient("ws://192.168.0.114:4412");
        touchClient.connect();
        
//        steeringClient = new SteeringClient("ws://192.168.0.109:4412");
        steeringClient = new SteeringClient("ws://192.168.0.114:4412");
        steeringClient.connect();
        
    }

    

    
    private OnClickListener startListener = new OnClickListener() {
        @Override
        public void onClick(View v) {
            // TODO Auto-generated method stub
            steeringClient.LetPosition(41.83528963278528, -87.87043537049175);
        }
    };
    
    @Override
    protected void onPause() {
        super.onPause();
        stopIoManager();
        if (sDriver != null) {
            try {
                sDriver.close();
            } catch (IOException e) {
                // Ignore.
            }
            sDriver = null;
        }
        if (sDriver2 != null) {
            try {
                sDriver2.close();
            } catch (IOException e) {
                // Ignore.
            }
            sDriver2 = null;
        }
        finish();
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.d(TAG, "Resumed, sDriver=" + sDriver);
        if (sDriver == null) {
            mTitleTextView.setText("No serial device.");
        } else {
            try {
                sDriver.open();
                sDriver.setParameters(115200, 8, UsbSerialDriver.STOPBITS_1, UsbSerialDriver.PARITY_NONE);
            } catch (IOException e) {
                Log.e(TAG, "Error setting up device: " + e.getMessage(), e);
                mTitleTextView.setText("Error opening device: " + e.getMessage());
                try {
                    sDriver.close();
                } catch (IOException e2) {
                    // Ignore.
                }
                sDriver = null;
                return;
            }
            mTitleTextView.setText("Serial device: " + sDriver.getClass().getSimpleName());
        }
        
        if (sDriver2 == null) {
            mTitleTextView.setText("No serial device.");
        } else {
            try {
                sDriver2.open();
                sDriver2.setParameters(115200, 8, UsbSerialDriver.STOPBITS_1, UsbSerialDriver.PARITY_NONE);
            } catch (IOException e) {
                Log.e(TAG, "Error setting up device: " + e.getMessage(), e);
                mTitleTextView.setText("Error opening device: " + e.getMessage());
                try {
                    sDriver2.close();
                } catch (IOException e2) {
                    // Ignore.
                }
                sDriver2 = null;
                return;
            }
            mTitleTextView.setText("Serial device: " + sDriver.getClass().getSimpleName());
        }
        onDeviceStateChange();
    }

    private void stopIoManager() {
        if (mSerialIoManager != null) {
            Log.i(TAG, "Stopping io manager ..");
            mSerialIoManager.stop();
            mSerialIoManager = null;
        }
    }

    private void startIoManager() {
        if (sDriver != null) {
            Log.i(TAG, "Starting io manager ..");
            mSerialIoManager = new SerialInputOutputManager(sDriver, mListener);
            mExecutor.submit(mSerialIoManager);
        }
        
        if (sDriver2 != null) {
            Log.i(TAG, "Starting io manager ..");
            mSerialIoManager2 = new SerialInputOutputManager(sDriver2, mListener2);
            mExecutor2.submit(mSerialIoManager2);
        }
    }

    private void onDeviceStateChange() {
        stopIoManager();
        startIoManager();
    }

    private void updateReceivedData(byte[] data) {
        final String message = "Read " + data.length + " bytes: \n"
                + HexDump.dumpHexString(data) + "\n\n";
        JSONObject TouchPad = new JSONObject();
        
        try {
            TouchPad.put("Button", data[0]);
          
            
        } catch (JSONException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }        
        
        // The steering controller sends uart data commands in increments of 4 data bytes
        // If four bytes are received then most likely it is from the steering wheel controller
        if(data.length == 4)
        {
            // The USB driver occasionally breaks an 8 byte packet from the trackpad
            // into smaller bytes.  If this happens and is broken into 4-4 then it could
            // be misinterpreted as the steering controller.  Check that the first byte
            // is valid and expected steering control data before proceeding.
            if(data[0] > 0x17)
            {    
                // Packaging of the JSON goes here for the steering control
//                mDumpTextView.append("Steering\n");
            
                // Figure out which packet this actually is.  Is it gesture or is it
                // x,y data.
                if((data[3] == -1) && (data[2] != -1))
                {
                    // A zero is no gesture and this information doesn't need to be passed on to the HMI
                    if((data[2] != 0) || (data[2] > 0))
                    {
                        if(data[2] == 1)
                        {
                            steeringClient.LetTap(0.5, 0.5, 1, 1);
                        }
                        else
                        {
                            switch(data[2])
                            {
                                case 2:
                                    
                                    steeringClient.LetGesture(SteeringGestures.oneFingerSwipeUp);
                                    
                                break;
                                
                                case 3:
                                    
                                    steeringClient.LetGesture(SteeringGestures.oneFingerSwipeDown);
                                    
                                break;

                                
                                case 4:
                                
                                    steeringClient.LetGesture(SteeringGestures.oneFingerSwipeLeft);
                                    
                                break;
                                
                                case 5:
                                    
                                    steeringClient.LetGesture(SteeringGestures.oneFingerSwipeRight);
                                    
                                break;
                            }
                                
                            
                        }
                    }
                }
                // This must be a x,y packet data
                else if((data[3] != -1) && (data[2] != -1))
                {
                    myHandlerSt.removeCallbacks(SteeringUpdateTimeTask);
                    
                    // normalize the x and y values
                    float x = data[2];
                    float y = data[3];
                    
                    // if the value is negative add 256 before normalizing it
                    if(x < 0)
                    {
                        x += 256;
                    }
                    
                    // if the value is negative add 256 before normalizing it
                    if(y < 0)
                    {
                        y += 256;
                    }
                    
                    // Normalize the values
                    x = (float) (x / 256.0);
                    y = (float) (y / 256.0);
                    
                    if(StPhaseState == SteeringPhase.start)
                    {
                        steeringClient.LetCursor(x, y, StPhaseState);
                        StPhaseState = SteeringPhase.change;
                    }
                    else if(StPhaseState == SteeringPhase.change)
                    {
                        // if the data has changed then store the latest value and transmit to hmi
                        if((x != TouchX) || (y != TouchY))
                        {
                            SteeringX = x;
                            SteeringY = y;
                            
                            steeringClient.LetCursor(x, y, StPhaseState);
                            StPhaseState = SteeringPhase.change;                            
                        }
                        
                        myHandlerSt.postDelayed(SteeringUpdateTimeTask, 75);
                        SteeringFlag = 1;
                    }             
                }
                
                // Check to see if there have been any changes to the buttons.  If there has then
                // send the button update out to the HMI
                if(data[0] != Button1Prev)
                {
                    // Has the up button changed?
                    if((data[0] & 0x1) != (Button1Prev & 0x1))
                    {
                        // Check to see whether it has been pressed or released
                        if((data[0] & 0x1) == 0x1)
                        {
                            // It has been released so transmit the release button press
                            steeringClient.LetButton(0, 0);
                        }
                        else
                        {
                            // It has been pressed so transmit the button press
                            steeringClient.LetButton(0, 1);
                        }
                    }
                    
                    // Has the up button changed?
                    if((data[0] & 0x8) != (Button1Prev & 0x8))
                    {
                        // Check to see whether it has been pressed or released
                        if((data[0] & 0x8) == 0x8)
                        {
                            // It has been released so transmit the release button press
                            steeringClient.LetButton(4, 0);
                        }
                        else
                        {
                            // It has been pressed so transmit the button press
                            steeringClient.LetButton(4, 1);
                        }
                    }
                    
                    Button1Prev = data[0];
                }
                
                // Check the second button byte for changed button data
                if(data[1] != Button2Prev)
                {
                    
                    Button2Prev = data[1];
                }
            }
        }
        
        else if(data.length == 8)
        {
            // Used to track the number of padding bytes
            int padcount = 0;
            
            // Packaging of the JSON goes here for the touch pad
 //           mDumpTextView.append("TouchPad\n");
            
            for(int i = 0; i < 8; i++)
            {
                // Is the data a padding byte?  Count how many pad bytes are in the packet
                if(data[i] == -1)
                {
                    padcount++;
                }
            }
            
                // Determine what kind of packet this is
                if(padcount == 3)
                {
                    // This is a gesture packet
                    
                    // Is this an expand gesture?
                    if(data[2] == 0xF)
                    {
                        // Send a fixed zoom rate for now 
                        touchClient.LetZoom((float)0.3, 2, 0);
                    }
                    // Is this a pinch gesture?
                    else if(data[2] == 0x10)
                    {
                        touchClient.LetZoom((float)-0.3,2, 0);
                    }
                    // This is some other gesture so use LetGesture to send it
                    else 
                    {
                        switch(data[2])
                        {
                            // No Gesture Do Nothing
                            case 0:
                                
                                
                            break;
                            
                            case 3:
                                
                                touchClient.LetGesture(TouchGestures.oneFingerSwipeUp);
                                
                            break;
                            
                            case 4:
                                
                                touchClient.LetGesture(TouchGestures.oneFingerSwipeDown);
                                
                            break;

                            
                            case 5:
                            
                                touchClient.LetGesture(TouchGestures.oneFingerSwipeLeft);
                                
                            break;
                            
                            case 6:
                                
                                touchClient.LetGesture(TouchGestures.oneFingerSwipeRight);
                                
                            break;
                            
                            case 9:
                                
                                touchClient.LetGesture(TouchGestures.twoFingerSwipeLeft);
                                
                            break;
                            
                           case 10:
                                
                                touchClient.LetGesture(TouchGestures.twoFingerSwipeRight);
                                
                            break;
          
  
                           case 7:
                               
                               touchClient.LetGesture(TouchGestures.twoFingerSwipeUp);
                               
                           break;
         

                           case 8:
                               
                               touchClient.LetGesture(TouchGestures.twoFingerSwipeDown);
                               
                           break;
   
                            
                        }
                        //touchClient.LetGesture(data[2]);
                    }
                    
                }
                // This is a single finger packet
                else if(padcount == 4)
                {
                    myHandler.removeCallbacks(UpdateTimeTask);
                    
                 // normalize the x and y values
                    float x = data[2];
                    float y = data[3];
                    
                    // if the value is negative add 256 before normalizing it
                    if(x < 0)
                    {
                        x += 256;
                    }
                    
                    // if the value is negative add 256 before normalizing it
                    if(y < 0)
                    {
                        y += 256;
                    }
                    
                    // Normalize the values
                    x = (float) (x / 256.0);
                    y = (float) (y / 256.0);
                                        
                    
                    if(ToPhaseState == TouchPhase.start)
                    {
                        touchClient.LetCursor(x, y, ToPhaseState);
                        ToPhaseState = TouchPhase.change;
                    }
                    else if(ToPhaseState == TouchPhase.change)
                    {
                        // if the data has changed then store the latest value and transmit to hmi
                        if((x != TouchX) || (y != TouchY))
                        {
                            TouchX = x;
                            TouchY = y;
                            
                            touchClient.LetCursor(x, y, ToPhaseState);
                            ToPhaseState = TouchPhase.change;                            
                        }
                        
                        myHandler.postDelayed(UpdateTimeTask, 75);
                        TouchFlag = 1;
                        
                    }
                }
                // This is a tap gesture packet
                else if(padcount == 5)
                {
                    touchClient.LetTap((float)0.5, (float)0.5, 1, data[2]);
                }
                // This is a multitouch scrolling gesture packet
                else if(padcount == 2)
                {
                    
                }
                
            }
       
        

        //        mDumpTextView.append(TouchPad.toString()+"\n");
//        mDumpTextView.append(message);
//        mScrollView.smoothScrollTo(0, mDumpTextView.getBottom());
        
        
    }

    /**
     * Starts the activity, using the supplied driver instance.
     *
     * @param context
     * @param driver
     */
    static void show(Context context, UsbSerialDriver driver,UsbSerialDriver driver2) {
        sDriver = driver;
        final Intent intent = new Intent(context, SerialConsoleActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_NO_HISTORY);
        context.startActivity(intent);
        
        sDriver2 = driver2;
        final Intent intent2 = new Intent(context, SerialConsoleActivity.class);
        intent2.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_NO_HISTORY);
        context.startActivity(intent2);
        
        
        
    }

}

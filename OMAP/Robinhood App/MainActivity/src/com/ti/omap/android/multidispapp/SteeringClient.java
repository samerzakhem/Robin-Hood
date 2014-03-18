package com.ti.omap.android.multidispapp; //com.example.nativetest;

import java.net.URI;
import java.util.TimerTask;

import android.os.Handler;
import android.util.Log;


import org.json.JSONException;
import org.json.JSONObject;

import com.codebutler.android_websockets.WebSocketClient;


public class SteeringClient extends WebSocketClient {
	public static final String TAG = "TouchClient";
	
    private static byte Button1Prev = 0x1F;
    private static byte Button2Prev = 0x0F;
    private SteeringPhase StPhaseState = SteeringPhase.start;

    
    private float SteeringX;
    private float SteeringY;
    
    Handler myHandlerSt = new Handler();   
    
    
	   public enum SteeringPhase
	    {
	       start,
	       change,
	       end
	    }
	   
	     public enum SteeringGestures
	     {
	         oneFingerSwipeLeft,
	         oneFingerSwipeRight,
	         oneFingerSwipeUp,
	         oneFingerSwipeDown
	     }
	   
	     private TimerTask SteeringUpdateTimeTask = new TimerTask()
	     {
	         @Override
	         public void run() {
	             // TODO Auto-generated method stub
	  //           mDumpTextView.append("Timer Expired\n");

	             // Timer expired so this is the last data packet
	             StPhaseState = SteeringPhase.end;
	             LetCursor(SteeringX, SteeringY, StPhaseState);
	             StPhaseState = SteeringPhase.start;
	         }
	         
	     };
	     
	     
	public SteeringClient(String uri) {
		super(URI.create(uri), new WebSocketClient.Listener() {
			
			public void onConnect() {
				Log.i(TAG, "Connected");
			}
			
			public void onMessage(String message) {
				Log.i(TAG, String.format("Received %s", message));
			}
			
			public void onMessage(byte[] data) {
			}
			
			public void onDisconnect(int code, String reason) {
			}
			
			public void onError(Exception error) {
			}
		}, null);
	}
	
	public void LetPosition(double lat, double lon) {
		JSONObject msg 		= new JSONObject();
        JSONObject params 	= new JSONObject();
        
        try {
        	params.put("latitude", 		lat);
        	params.put("longitude", 	lon);
        
        	msg.put("gps.LetPosition", 		params);
        	
        } catch(JSONException e) {}

        this.send( msg.toString() );

	}
	

	
	/*************************************************************************************
	 * 
	 * Below are the public definitions for the steering wheel controls
	 * 
	 *************************************************************************************/
	public void LetTap(double d, double f, int fingerCount, int clickCount)
	{
        JSONObject msg      = new JSONObject();
        JSONObject params   = new JSONObject();
        
        try {
            params.put("x",      d);
            params.put("y",      f);
            params.put("fingerCount", fingerCount);
            params.put("fingerCount", clickCount);
            
            msg.put("swc.LetTap",      params);
            
        } catch(JSONException e) {}

        this.send( msg.toString() );
	    
	}
	
	public void LetCursor(float x, float y, SteeringPhase phase)
	{
        JSONObject msg      = new JSONObject();
        JSONObject params   = new JSONObject();
        
        try {
            params.put("x",      y);
            params.put("y",      x);
            params.put("phase", phase);
            
            msg.put("swc.LetCursor",      params);
            
        } catch(JSONException e) {}

        this.send( msg.toString() );	    
	}
	
	
	public void LetGesture(SteeringGestures gesture){
        JSONObject msg      = new JSONObject();
        JSONObject params   = new JSONObject();
        
        try {
            params.put("gesture",      gesture);
            
            msg.put("swc.LetGesture",      params);
            
        } catch(JSONException e) {}

        this.send( msg.toString() );
	    
	}
	
	public void LetButton(double name, double state){
        JSONObject msg      = new JSONObject();
        JSONObject params   = new JSONObject();
        
        try {
            params.put("name",      name);
            params.put("state",      state);
            
            msg.put("swc.LetButton",      params);
            
        } catch(JSONException e) {}

        this.send( msg.toString() );	    
	}
	
	
	
	
	
	
	
	public void LetCursor(double x, double y, double phase) {
        JSONObject msg      = new JSONObject();
        JSONObject params   = new JSONObject();
        
        try {
            params.put("x",      x);
            params.put("y",      y);
            params.put("phase", phase);
            
            msg.put("swc.LetCursor",      params);
            
        } catch(JSONException e) {}

        this.send( msg.toString() );

    }
	
	public void ProcessMessage(byte[] data) {
        // The USB driver occasionally breaks an 8 byte packet from the trackpad
        // into smaller bytes.  If this happens and is broken into 4-4 then it could
        // be misinterpreted as the steering controller.  Check that the first byte
        // is valid and expected steering control data before proceeding.
        if(data[0] > 0x17)
        {    
            // Packaging of the JSON goes here for the steering control
//            mDumpTextView.append("Steering\n");
        
            // Figure out which packet this actually is.  Is it gesture or is it
            // x,y data.
            if((data[3] == -1) && (data[2] != -1))
            {
                // A zero is no gesture and this information doesn't need to be passed on to the HMI
                if((data[2] != 0) || (data[2] > 0))
                {
                    if(data[2] == 1)
                    {
                        LetTap(0.5, 0.5, 1, 1);
                    }
                    else
                    {
                        switch(data[2])
                        {
                            case 2:
                                
                                LetGesture(SteeringGestures.oneFingerSwipeUp);
                                
                            break;
                            
                            case 3:
                                
                                LetGesture(SteeringGestures.oneFingerSwipeDown);
                                
                            break;

                            
                            case 4:
                            
                                LetGesture(SteeringGestures.oneFingerSwipeLeft);
                                
                            break;
                            
                            case 5:
                                
                                LetGesture(SteeringGestures.oneFingerSwipeRight);
                                
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
                    LetCursor(x, y, StPhaseState);
                    StPhaseState = SteeringPhase.change;
                }
                else if(StPhaseState == SteeringPhase.change)
                {
                    // if the data has changed then store the latest value and transmit to hmi
                    if((x != SteeringX) || (y != SteeringY))
                    {
                        SteeringX = x;
                        SteeringY = y;
                        
                        LetCursor(x, y, StPhaseState);
                        StPhaseState = SteeringPhase.change;                            
                    }
                    
                    myHandlerSt.postDelayed(SteeringUpdateTimeTask, 75);                  
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
                        LetButton(0, 0);
                    }
                    else
                    {
                        // It has been pressed so transmit the button press
                        LetButton(0, 1);
                    }
                }
                
                // Has the up button changed?
                if((data[0] & 0x8) != (Button1Prev & 0x8))
                {
                    // Check to see whether it has been pressed or released
                    if((data[0] & 0x8) == 0x8)
                    {
                        // It has been released so transmit the release button press
                        LetButton(4, 0);
                    }
                    else
                    {
                        // It has been pressed so transmit the button press
                        LetButton(4, 1);
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
}

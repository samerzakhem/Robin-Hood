package com.ti.omap.android.multidispapp; //com.example.nativetest;

import java.net.URI;
import java.util.TimerTask;


import android.os.Handler;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import com.codebutler.android_websockets.WebSocketClient;


public class TouchClient extends WebSocketClient {
	public static final String TAG = "TouchClient";
	
    Handler myHandler = new Handler();    
    private TouchPhase ToPhaseState = TouchPhase.start;
    
    private float TouchX;
    private float TouchY;
     
	 public enum TouchPhase
     {
        start,
        change,
        end
     }
	 
	 public enum TouchGestures
	 {
	     oneFingerSwipeLeft,
	     oneFingerSwipeRight,
	     oneFingerSwipeUp,
	     oneFingerSwipeDown,
	     twoFingerSwipeLeft,
	     twoFingerSwipeRight,
	     twoFingerSwipeUp,
	     twoFingerSwipeDown,
	     pinch,
	     spread,
	     back,
	     registerLeft,
	     registerCenter,
	     registerRight
	 }
	 
	   private TimerTask UpdateTimeTask = new TimerTask()
	    {
	        @Override
	        public void run() {
	            // TODO Auto-generated method stub
//	            mDumpTextView.append("Timer Expired\n");

	                // Timer expired so this is the last data packet
	                ToPhaseState = TouchPhase.end;
	                LetCursor(TouchX, TouchY, ToPhaseState);
	                ToPhaseState = TouchPhase.start;
	        }
	        
	    };
	    
	public TouchClient(String uri) {
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
				Log.d(TAG, "Socket Connection Error");
			}
		}, null);
	}


	  
	/*************************************************************************************
	 * 
	 * Below are the public definitions for the steering wheel controls
	 * 
	 *************************************************************************************/
	public void LetTap(float x, float y, int fingerCount, int clickCount)
	{
        JSONObject msg      = new JSONObject();
        JSONObject params   = new JSONObject();
        
        try {
            params.put("x",      x);
            params.put("y",      y);
            params.put("fingerCount", fingerCount);
            params.put("fingerCount", clickCount);
            
            msg.put("touch.LetTap",      params);
            
        } catch(JSONException e) {}

        this.send( msg.toString() );
	    
	}
	
	public void LetGesture(TouchGestures gesture){
        JSONObject msg      = new JSONObject();
        JSONObject params   = new JSONObject();
        
        try {
            params.put("gesture",      gesture);
            
            msg.put("touch.LetGesture",      params);
            
        } catch(JSONException e) {}

        this.send( msg.toString() );
	    
	}
	
	public void LetButton(double name, double state){
        JSONObject msg      = new JSONObject();
        JSONObject params   = new JSONObject();
        
        try {
            params.put("name",      name);
            params.put("state",      state);
            
            msg.put("touch.LetButton",      params);
            
        } catch(JSONException e) {}

        this.send( msg.toString() );	    
	}
	
	
	
	
	
	
	
	public void LetCursor(float x, float y, TouchPhase phase) {
        JSONObject msg      = new JSONObject();
        JSONObject params   = new JSONObject();
        
        try {
            params.put("x",      x);
            params.put("y",      y);
            params.put("phase", phase);
            
            msg.put("touch.LetCursor",      params);
            
        } catch(JSONException e) {}

        this.send( msg.toString() );

    }
	
	   public void LetZoom(float delta, int fingercount, double phase) {
	        JSONObject msg      = new JSONObject();
	        JSONObject params   = new JSONObject();
	        
	        try {
	            params.put("delta",      delta);
	            params.put("fingercount",      fingercount);
	            params.put("phase", phase);
	            
	            msg.put("touch.LetZoom",      params);
	            
	        } catch(JSONException e) {}

	        this.send( msg.toString() );

	    }
	   
	    public static String byteToHex(byte b){
	        int i = b & 0xff;
	        
	        if(i<0)
	        {
	            i = (i * -1) + 128;
	        }
	        
	        return Integer.toHexString(i);
	    }
	   
	   
	   public void ProcessMessage(byte[] data)
	   {
           // Used to track the number of padding bytes
           int fingercount = data[1];
           
           	   if(data[0] == 1)
           	   {
           		   LetGesture(TouchGestures.back);
           	   }
           
               // Determine what kind of packet this is
               if(fingercount == 0)
               {
                   // This is a gesture packet
                   
                   // Is this an expand gesture?
                   if(data[2] == 0xF)
                   {
                       // Send a fixed zoom rate for now 
                	   LetGesture(TouchGestures.spread);
                   }
                   // Is this a pinch gesture?
                   else if(data[2] == 0x10)
                   {
                       LetGesture(TouchGestures.pinch);
                   }
                   // This is some other gesture so use LetGesture to send it
                   else 
                   {
                       switch(data[2])
                       {
                           // No Gesture Do Nothing
                           case 0:
                               
                               
                           break;

                           case 1:
                   
                        	   LetTap((float)0.5, (float)0.5, 1, data[2]);
                               
                           break;

                           case 2:

                        	   LetTap((float)0.5, (float)0.5, 1, data[2]);
                        	   
                               
                           break;

                           case 3:
                               
                               LetGesture(TouchGestures.oneFingerSwipeUp);
                               
                           break;
                           
                           case 4:
                               
                               LetGesture(TouchGestures.oneFingerSwipeDown);
                               
                           break;

                           
                           case 5:
                           
                               LetGesture(TouchGestures.oneFingerSwipeLeft);
                               
                           break;
                           
                           case 6:
                               
                               LetGesture(TouchGestures.oneFingerSwipeRight);
                               
                           break;
                           
                           case 9:
                               
                               LetGesture(TouchGestures.twoFingerSwipeLeft);
                               
                           break;
                           
                          case 10:
                               
                               LetGesture(TouchGestures.twoFingerSwipeRight);
                               
                           break;
         
 
                          case 7:
                              
                              LetGesture(TouchGestures.twoFingerSwipeUp);
                              
                          break;
        

                          case 8:
                              
                              LetGesture(TouchGestures.twoFingerSwipeDown);
                              
                          break;
  
                           
                       }
                       //touchClient.LetGesture(data[2]);
                   }
                   
               }
               // This is a single finger packet
               else if(fingercount == 1)
               {
                   myHandler.removeCallbacks(UpdateTimeTask);
                   
                // normalize the x and y values
                   int x = data[2];
                   int y = data[3];
                                      
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
                   
                   // Check to see if the touch is in the top part of the touchpad
                   // If it is, then this is a register gesture.
                   if(y > 245)
                   {
                	   if(x < 85)
                	   {
                		   LetGesture(TouchGestures.registerLeft);   
                	   }
                	   else if ((x >= 85) && (x < 170))
                	   {
                		   LetGesture(TouchGestures.registerCenter);
                	   }
                	   else
                	   {
                		   LetGesture(TouchGestures.registerRight);
                	   }
                   }
                   
                   
                   // Define variable to calculate floating point scaling
                   float xf;
                   float yf;
                   
                   // Normalize the values
                   xf = (float) (x / 256.0);
                   yf = (float) (y / 256.0);
                                       
                   // invert the signal
                   xf = 1 - xf;
                   yf = 1 - yf;
                   
                   if(ToPhaseState == TouchPhase.start)
                   {
                       LetCursor(xf, yf, ToPhaseState);
                       ToPhaseState = TouchPhase.change;
                   }
                   else if(ToPhaseState == TouchPhase.change)
                   {
                       // if the data has changed then store the latest value and transmit to hmi
                       if((xf != TouchX) || (yf != TouchY))
                       {
                           TouchX = xf;
                           TouchY = yf;
                           
                           LetCursor(xf, yf, ToPhaseState);
                           ToPhaseState = TouchPhase.change;                            
                       }
                       
                       myHandler.postDelayed(UpdateTimeTask, 75);
                   }
               }
	   }	   
}

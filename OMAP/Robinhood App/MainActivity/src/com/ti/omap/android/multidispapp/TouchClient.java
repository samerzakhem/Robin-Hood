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
	     spread
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
	   
	   public void ProcessMessage(byte[] data)
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
                       LetZoom((float)0.3, 2, 0);
                   }
                   // Is this a pinch gesture?
                   else if(data[2] == 0x10)
                   {
                       LetZoom((float)-0.3,2, 0);
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
                       LetCursor(x, y, ToPhaseState);
                       ToPhaseState = TouchPhase.change;
                   }
                   else if(ToPhaseState == TouchPhase.change)
                   {
                       // if the data has changed then store the latest value and transmit to hmi
                       if((x != TouchX) || (y != TouchY))
                       {
                           TouchX = x;
                           TouchY = y;
                           
                           LetCursor(x, y, ToPhaseState);
                           ToPhaseState = TouchPhase.change;                            
                       }
                       
                       myHandler.postDelayed(UpdateTimeTask, 75);
                   }
               }
               // This is a tap gesture packet
               else if(padcount == 5)
               {
                   LetTap((float)0.5, (float)0.5, 1, data[2]);
               }
               // This is a multitouch scrolling gesture packet
               else if(padcount == 2)
               {
                   
               }            		   	   
	   }	   
}

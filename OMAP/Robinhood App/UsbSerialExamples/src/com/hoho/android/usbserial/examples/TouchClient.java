package com.hoho.android.usbserial.examples; //com.example.nativetest;

import java.net.URI;


import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import com.codebutler.android_websockets.WebSocketClient;


public class TouchClient extends WebSocketClient {
	public static final String TAG = "TouchClient";
	
	
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
}

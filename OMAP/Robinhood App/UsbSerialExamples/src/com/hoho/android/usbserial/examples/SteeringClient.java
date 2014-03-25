package com.hoho.android.usbserial.examples; //com.example.nativetest;

import java.net.URI;
import android.util.Log;


import org.json.JSONException;
import org.json.JSONObject;

import com.codebutler.android_websockets.WebSocketClient;


public class SteeringClient extends WebSocketClient {
	public static final String TAG = "TouchClient";
	
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
}

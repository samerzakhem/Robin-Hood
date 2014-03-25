package com.ignite.androidsockets;

import java.net.URI;
import java.util.Arrays;
import java.util.List;

import org.apache.http.message.BasicNameValuePair;
import org.json.JSONArray;
import org.json.JSONException;

import android.os.Handler;
import android.util.Log;
import android.webkit.WebView;

import com.codebutler.android_websockets.WebSocketClient;
import com.ignite.webview_communicator.Communicator;
import com.ignite.webview_communicator.WebViewCommunicator;

/**
 * @version 0.1
 *
 * Class for processing websocket requests recieved from the Websocket shim
 * inserted in the WebView. It is basically a wrapper around the WebSocketClient.
 * It also handles the passing of response from WebSocketClient to the
 * WebSocket shim in the javascript.
 */
public class AndroidSockets implements Communicator {
	
	WebSocketClient client;
	WebViewCommunicator webViewCommunicator;

	/**
	 * AndroidSockets requires an instance of WebViewCommunicator for
	 * sending messages to the Websocket shim.
	 *
	 * @param wc an instance of WebViewCommunicator initialized using the WebView
	 *           which contains the websocket shim 
	 */
	public AndroidSockets(WebViewCommunicator wc) {
		webViewCommunicator = wc;
        wc.register("AndroidWebSocket", this);
	}

    /**
     * AndroidSockets requires an instance of WebViewCommunicator for
     * sending messages to the Websocket shim.
     *
     * @param webview the webview for which you want to emulate websockets
     * @param handler an instance of os.android.handler, required by WebViewCommunicator
     */
    public AndroidSockets(WebView webview, Handler handler) {
        webViewCommunicator = new WebViewCommunicator(webview, handler);
        webViewCommunicator.register("AndroidWebSocket", this);
    }

	/**
	 * Implementation of the {@link com.ignite.webview_communicator.Communicator Communicator} interface.
	 * It simply maps the request received from the WebSocket shim to appropriate
	 * calls to WebSocket client
	 */
	@Override
	public void router(String method, JSONArray arg) {
		try {
			if(method.equals("send")) {
				send(arg.getString(0));
			}
		
			if(method.equals("connect")) {
				connect(arg.getString(0));
			}
		
			if(method.equals("close")) {
				close();
			}
		} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
		}	
	}	

	/**
	 * Forwards send requests from websocket shim to WebSocketClient
	 *
	 * @param request - the request made by WebSocket shim
	 */
	private void send(String request) {
        if(client == null) {
            Log.e("Socket IO", "Client not initialized");
        } else {
        	client.send(request);
        }
    }
	
	/**
	 * Connects the WebSocketClient to the url requested by the WebSocket shim
	 *
	 * @param url - the url the websocket shim wants to connect
	 */
    private void connect(String url) {
        final String URL = url;
        Runnable task = new Runnable() {
                @Override
                public void run() {
                    initSocket(URL);
                }
            };
        new Thread(task).start();
    }
	
	/**
	 * Closes the websocket connection.
	 */
    private void close() {
        client.disconnect();
    }

	/**
	 * Initializes the websocket, it sets up the WebSocketClient and
	 * communication with WebSocket shim
	 *
	 * @param url - the url the Websocket shim requested to connect to
	 */
	private void initSocket(String url) {
	    URI uri = URI.create(url);

		List<BasicNameValuePair> extraHeaders = Arrays.asList(
		    new BasicNameValuePair("Sec-WebSocket-Extensions", "x-webkit-deflate-frame")
		);
		
        client = new WebSocketClient(uri, new WebSocketClient.Listener() {
				
			@Override
			public void onMessage(byte[] data) {
				JSONArray args = new JSONArray();
				args.put(new String(data));
				webViewCommunicator.callJS("AndroidWebSocket", "message", args);
			}
				
			@Override
			public void onMessage(String message) {
				JSONArray args = new JSONArray();
				args.put(message);
				webViewCommunicator.callJS("AndroidWebSocket", "message", args);
			}
				
			@Override
			public void onError(Exception error) {
				Log.w("Web Interface", "Error occured while connecting");
				Log.w("Web ", error.toString());
				webViewCommunicator.callJS("AndroidWebSocket", "error", new JSONArray());
			}
				
			@Override
			public void onDisconnect(int code, String reason) {
				JSONArray args = new JSONArray();
				args.put(code);
				args.put(reason);
				webViewCommunicator.callJS("AndroidWebSocket", "disconnect", args);
			}
				
			@Override
			public void onConnect() {
				webViewCommunicator.callJS("AndroidWebSocket", "connect", new JSONArray());
			}
		}, extraHeaders);
        
		client.connect();
	}
}

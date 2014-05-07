/*
 * Copyright (C) Texas Instruments - http://www.ti.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.ti.omap.android.multidispapp;

//import java.util.TimerTask;

import com.ignite.androidsockets.AndroidSockets;
import com.strumsoft.websocket.phonegap.WebSocketFactory;

import android.content.Context;
import android.util.DisplayMetrics;
import android.util.Log;
//import android.os.Handler;
import android.view.Display;
import android.webkit.WebChromeClient;
//import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class HelloPresentation extends DDPresentation {

	protected static final String TAG = "Map Side Error";
	
	WebView myWebView;
//    Handler myHandler = new Handler();   
	
//    private TimerTask ReloadTimeTask = new TimerTask()
//    {
//        @Override
//        public void run() {
//        	myWebView.reload();
//        	myHandler.postDelayed(ReloadTimeTask, 30);
//        }
//    };
    private class MyWebViewClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
        	view.loadUrl(url);
		return false;
        }
        
        @Override
        public void onReceivedError(WebView view, int errorCode,
                String description, String failingUrl) {
        	Log.d(TAG,"Web Error");
        }
        
        @Override
        public void onPageFinished(WebView view, String url)
        {

        	view.clearCache(true);
        }
    }
    
    public HelloPresentation(Context outerContext, Display display,
            PresentationContents pContents) {
        super(outerContext, display, pContents);
        setContentView(R.layout.hello);
        
        myWebView = (WebView)findViewById(R.id.webview);

        myWebView.setWebChromeClient(new WebChromeClient() {
        	public void onConsoleMessage(String message, int lineNumber, String sourceID) {
        		Log.d(TAG, String.format("%s -- from %d of %s", message, lineNumber, sourceID));
        	}
        });
        
        myWebView.setWebViewClient(new MyWebViewClient());

        myWebView.getSettings().setJavaScriptEnabled(true);
        
        myWebView.getSettings().setAllowUniversalAccessFromFileURLs(true);
        myWebView.getSettings().setAllowFileAccessFromFileURLs(true);
        myWebView.getSettings().setDomStorageEnabled(true);
        
//        AndroidSockets socket = new AndroidSockets(myWebView, new android.os.Handler());
        myWebView.addJavascriptInterface(new WebSocketFactory(myWebView), "WebSocketFactory");
        
        // For web connectivity testing
//        myWebView.loadUrl("http://www.yahoo.com");
        
        // For use on Robinhood Network
        myWebView.loadUrl("http://192.168.0.114/Robin-Hood/nfuzion/hmi/js/");

        // For use on Beningo Engineering network
 //       myWebView.loadUrl("http://10.0.0.19/Robin-Hood/nfuzion/hmi/js/");
        
 //       myHandler.postDelayed(ReloadTimeTask, 30);
         DisplayMetrics metrics = new DisplayMetrics();
         getWindow().getWindowManager().getDefaultDisplay().getMetrics(metrics);
//         getWindowManager().getDefaultDisplay().getMetrics(metrics);
        
    }
}

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

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


import android.app.ActionBar;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.app.Presentation;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.Resources;
import android.hardware.display.DisplayManager;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.os.SystemClock;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.SparseArray;
import android.view.Display;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemSelectedListener;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.CompoundButton.OnCheckedChangeListener;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.hoho.android.usbserial.driver.UsbSerialDriver;
import com.hoho.android.usbserial.driver.UsbSerialProber;
import com.hoho.android.usbserial.util.SerialInputOutputManager;


import com.ti.omap.android.multidispapp.graphics.GameControlFragment;
import com.ti.omap.android.multidispapp.graphics.GamePresentation;
import com.ti.omap.android.multidispapp.graphics.GraphicControllerFragment;
import com.ti.omap.android.multidispapp.graphics.GraphicPresentation;
import com.ti.omap.android.multidispapp.graphics.OpenGLPresentation;
import com.ti.omap.android.multidispapp.photo.PhotoPresentation;
import com.ti.omap.android.multidispapp.photo.PrimaryPhotoFragment;
import com.ti.omap.android.multidispapp.video.PrimaryVideoFragment;
import com.ti.omap.android.multidispapp.video.SingleVideoPresentation;
import com.ti.omap.android.multidispapp.video.VideoPresentation;

import com.ignite.androidsockets.AndroidSockets;



public class MainActivity extends Activity implements OnCheckedChangeListener,
        OnCommandListener {

    private final String TAG = "DDActivity";

    // Keys for storing saved instance state.
    private static final String PRESENTATION_KEY = "presentation";
    private static final String OPERATION_KEY = "operation";

    final public static int OPERATION_HELLO = 0;
    final public static int OPERATION_GRAPHICS = 1;
    final public static int OPERATION_GRAPHICS_GL = 2;
    final public static int OPERATION_VIDEO = 3;
    final public static int OPERATION_PHOTO = 4;
    final public static int OPERATION_GAME = 5;
    final public static int OPERATION_TRIPLE_DISP_VIDEO = 6;
    
    // Software is setup to run the HDMI display with gaze detection
    final public static int INPUT_DEVICE = 0;
    final public static int GAZE_DEVICE = 1;
    
    // Software is setup to run the HDMI display with alps input devices
//    final public static int INPUT_DEVICE = 1;
  
    private static int mDeviceConfiguration = INPUT_DEVICE;

    private static int mOperation;
    //UPDATED from true to false
    public static boolean isSingleDisplay = false;

    private DisplayManager mDisplayManager;
    private DisplayListAdapter mDisplayListAdapter;
    private List<Display> mSelectedExtDisplayList;
    private CheckBox mEnableExternalDisplayCheckBox;
//    private Spinner mOperationsSpinner;
    private PrimaryFragment mPrimaryFragment;
    // List of presentation contents indexed by displayId.
    // This state persists so that we can restore the old presentation
    // contents when the activity is paused or resumed.
    private SparseArray<PresentationContents> mSavedPresentationContents;

    // List of all currently visible presentations
    private static List<DDPresentation> mActivePresentations;
    private WebView myWebViewDPI;
//    Handler myHandler = new Handler();    
    
    private UsbManager mUsbManager;
    
    private static final int MESSAGE_REFRESH = 101;
    private static final long REFRESH_TIMEOUT_MILLIS = 5000;

    private TouchClient touchClient;
    private SteeringClient steeringClient;


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
//    private static UsbSerialDriver sDriver3 = null;
    


    private final ExecutorService mExecutor = Executors.newSingleThreadExecutor();
    private final ExecutorService mExecutor2 = Executors.newSingleThreadExecutor();
 //   private final ExecutorService mExecutor3 = Executors.newSingleThreadExecutor();
    
    private SerialInputOutputManager mSerialIoManager;
    private SerialInputOutputManager mSerialIoManager2;
//    private SerialInputOutputManager mSerialIoManager3;

    private static boolean UsbConnected = false;
 //   private static boolean GazeUsbConnected = false;


    
   
    
    
    private final SerialInputOutputManager.Listener mListener =
            new SerialInputOutputManager.Listener() {

        @Override
        public void onRunError(Exception e) {
            Log.d(TAG, "Runner stopped.");
            
        }

        @Override
        public void onNewData(final byte[] data) {
            MainActivity.this.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                	MainActivity.this.updateReceivedData(data);
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
        	MainActivity.this.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                	MainActivity.this.updateReceivedData(data);
                }
            });
        }
    };    

    /*
    private final SerialInputOutputManager.Listener mGazeListener3 =
            new SerialInputOutputManager.Listener() {

        @Override
        public void onRunError(Exception e) {
            Log.d(TAG, "Gaze Runner stopped.");
        }

        @Override
        public void onNewData(final byte[] data) {
        	MainActivity.this.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                	MainActivity.this.parseGazeData(data);
                }
            });
        }
    };    
    */
    
 
    
 
    
    
    private final Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case MESSAGE_REFRESH:
                	if(UsbConnected == false)
                	{
                		refreshDeviceList();
                		mHandler.sendEmptyMessageDelayed(MESSAGE_REFRESH, REFRESH_TIMEOUT_MILLIS);
                	}
                    break;
                default:
                    super.handleMessage(msg);
                    break;
            }
        }

    };

    /** Simple container for a UsbDevice and its driver. */
    private static class DeviceEntry {
        public UsbDevice device;
        public UsbSerialDriver driver;

        DeviceEntry(UsbDevice device, UsbSerialDriver driver) {
            this.device = device;
            this.driver = driver;
        }
    }

    private List<DeviceEntry> mEntries = new ArrayList<DeviceEntry>();
//    private ArrayAdapter<DeviceEntry> mAdapter;
   
    
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
    
  
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        
        ActionBar actionBar = getActionBar();
        actionBar.setCustomView(R.layout.actionbar);
        actionBar.setDisplayOptions(ActionBar.DISPLAY_SHOW_CUSTOM);
        

        // Restore saved instance state.
        if (savedInstanceState != null) {
            mSavedPresentationContents = savedInstanceState
                    .getSparseParcelableArray(PRESENTATION_KEY);
        } else {
            mSavedPresentationContents = new SparseArray<PresentationContents>();
        }

        // Get the display manager service.
        mDisplayManager = (DisplayManager) getSystemService(Context.DISPLAY_SERVICE);

        if (savedInstanceState != null) {
            mOperation = savedInstanceState.getInt(OPERATION_KEY);
        } else {
            mOperation = OPERATION_HELLO;
        }

        // Set up the list of displays.
        mDisplayListAdapter = new DisplayListAdapter(this);

        // Hide the action bar
        actionBar.hide();
        setContentView(R.layout.main);

//UPDATED
 /*       
        mOperationsSpinner = (Spinner) actionBar.getCustomView().findViewById(
                R.id.spinner_operation_mode);
        initOperationModeSpinner(mOperationsSpinner);
*/
        // Set up checkbox to toggle between showing all displays or only
        // presentation displays.
//UPDATED to remove the checkbox
        mEnableExternalDisplayCheckBox = (CheckBox) actionBar.getCustomView()
                .findViewById(R.id.button_enable_external_display);
        mEnableExternalDisplayCheckBox.setOnCheckedChangeListener(this);

        mActivePresentations = new ArrayList<DDPresentation>();
 
        
        
        
        myWebViewDPI = (WebView)findViewById(R.id.webviewdpi);
        
        myWebViewDPI.setWebChromeClient(new WebChromeClient() {
        	public void onConsoleMessage(String message, int lineNumber, String sourceID) {
        		Log.d(TAG, String.format("%s -- from %d of %s", message, lineNumber, sourceID));
        	}
        });
        
        myWebViewDPI.setWebViewClient(new MyWebViewClient());
        


        myWebViewDPI.getSettings().setJavaScriptEnabled(true);

        myWebViewDPI.getSettings().setAllowUniversalAccessFromFileURLs(true);
        myWebViewDPI.getSettings().setAllowFileAccessFromFileURLs(true);        
        myWebViewDPI.getSettings().setDomStorageEnabled(true);
        
        AndroidSockets socket = new AndroidSockets(myWebViewDPI, new android.os.Handler());
 
        // For testing web connectivity
//        myWebViewDPI.loadUrl("http://www.google.com");

        // Is this for the input device DPI Display?
        if(mDeviceConfiguration == INPUT_DEVICE)
        {	
	        // For use on Robinhood Network
	        myWebViewDPI.loadUrl("http://192.168.0.114/Robin-Hood/nfuzion/cluster/js/");
        }
        // Is this for the hdmi display with gaze detection?
        else if (mDeviceConfiguration == GAZE_DEVICE)
        {
        	myWebViewDPI.loadUrl("http://192.168.0.114/Robin-Hood/nfuzion/hmi/js/");
        }
        
// For use on Beningo Engineering Network        
//        myWebViewDPI.loadUrl("http://10.0.0.19/Robin-Hood/nfuzion/cluster/js/");

        // Hide the navigation bar
        View decorView = getWindow().getDecorView();
        int uiOptions = View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION;
        decorView.setSystemUiVisibility(uiOptions);

        // Hide the status bar
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        
        mUsbManager = (UsbManager) getSystemService(Context.USB_SERVICE);
        

 //       myHandler.postDelayed(ReloadTimeTask, 30);
         
      
        // Is this for the input device DPI Display?
        if(mDeviceConfiguration == INPUT_DEVICE)
        {	
//          touchClient = new TouchClient("ws://192.168.0.109:4412");
            touchClient = new TouchClient("ws://192.168.0.114:4412");
            touchClient.connect();
            
//            steeringClient = new SteeringClient("ws://192.168.0.109:4412");
            steeringClient = new SteeringClient("ws://192.168.0.114:4412");
            steeringClient.connect();
        }
        // Is this for the hdmi display with gaze detection?
        else if (mDeviceConfiguration == GAZE_DEVICE)
        {
        	// No additional setup required
        }
        
      
      DisplayMetrics metrics = new DisplayMetrics();
      getWindow().getWindowManager().getDefaultDisplay().getMetrics(metrics);
    };
    

    
    
//    private TimerTask ReloadTimeTask = new TimerTask()
//    {
//        @Override
//        public void run() {
//        	myWebViewDPI.reload();
//        	myHandler.postDelayed(ReloadTimeTask, 30);
//        }
//    };
    
    @Override
    protected void onResume() {
        super.onResume();

        mHandler.sendEmptyMessage(MESSAGE_REFRESH);
        
        // Restore presentations from before the activity was paused.
        final int numDisplays = mDisplayListAdapter.getCount();
        for (int i = 0; i < numDisplays; i++) {
            final PresentationContents contents = mSavedPresentationContents
                    .get(mDisplayListAdapter.getItem(i).getDisplayId());
            if (contents != null) {
                final Display display = mDisplayManager
                        .getDisplay(contents.displayId);
                if (display == null) {
                    // external display disconnected
                    continue;
                }
                DDPresentation presentation = buildPresentation(contents,
                        display);
                showPresentation(presentation);
                
                View decorView = getWindow().getDecorView();
                int uiOptions = View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION;
                decorView.setSystemUiVisibility(uiOptions);
                
               
            }
            
            
            Log.d(TAG, "Resumed, sDriver=" + sDriver);
            if (sDriver == null) {
//                mTitleTextView.setText("No serial device.");
            } else {
                try {
                    sDriver.open();
                    sDriver.setParameters(115200, 8, UsbSerialDriver.STOPBITS_1, UsbSerialDriver.PARITY_NONE);
                } catch (IOException e) {
                    Log.e(TAG, "Error setting up device: " + e.getMessage(), e);
//                    mTitleTextView.setText("Error opening device: " + e.getMessage());
                    try {
                        sDriver.close();
                    } catch (IOException e2) {
                        // Ignore.
                    }
                    sDriver = null;
                    return;
                }
//                mTitleTextView.setText("Serial device: " + sDriver.getClass().getSimpleName());
            }
            
            if (sDriver2 == null) {
//                mTitleTextView.setText("No serial device.");
            } else {
                try {
                    sDriver2.open();
                    sDriver2.setParameters(115200, 8, UsbSerialDriver.STOPBITS_1, UsbSerialDriver.PARITY_NONE);
                } catch (IOException e) {
                    Log.e(TAG, "Error setting up device: " + e.getMessage(), e);
//                    mTitleTextView.setText("Error opening device: " + e.getMessage());
                    try {
                        sDriver2.close();
                    } catch (IOException e2) {
                        // Ignore.
                    }
                    sDriver2 = null;
                    return;
                }
//                mTitleTextView.setText("Serial device: " + sDriver.getClass().getSimpleName());
            }

            
            
/*            
            if (sDriver3 == null) {
//              mTitleTextView.setText("No serial device.");
          } else {
              try {
                  sDriver3.open();
                  sDriver3.setParameters(115200, 8, UsbSerialDriver.STOPBITS_1, UsbSerialDriver.PARITY_NONE);
              } catch (IOException e) {
                  Log.e(TAG, "Error setting up device: " + e.getMessage(), e);
//                  mTitleTextView.setText("Error opening device: " + e.getMessage());
                  try {
                      sDriver3.close();
                  } catch (IOException e2) {
                      // Ignore.
                  }
                  sDriver3 = null;
                  return;
              }
//              mTitleTextView.setText("Serial device: " + sDriver.getClass().getSimpleName());
          }
*/
            onDeviceStateChange();
            
//            View decorView = getWindow().getDecorView();
//            int uiOptions = View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION;
//            decorView.setSystemUiVisibility(uiOptions);

        }
        mDisplayListAdapter.updateContents();
//UPDATED removed

        if (mEnableExternalDisplayCheckBox.isChecked() != !mDisplayListAdapter
                .isEmpty()) {
            mEnableExternalDisplayCheckBox.setChecked(!mDisplayListAdapter
                    .isEmpty());
        }

        mSavedPresentationContents.clear();

        // Register to receive events from the display manager.
        mDisplayManager.registerDisplayListener(mDisplayListener, null);
        

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
  
        /*
        if (sDriver3 != null) {
            try {
                sDriver3.close();
            } catch (IOException e) {
                // Ignore.
            }
            sDriver3 = null;
        }
        */
        
        finish();
        
        mHandler.removeMessages(MESSAGE_REFRESH);
        
        // Unregister from the display manager.
        mDisplayManager.unregisterDisplayListener(mDisplayListener);

        // Dismiss all of our presentations but remember their contents.
        Log.d(TAG,
                "Activity is being paused.  Dismissing all active presentation.");
        for (DDPresentation presentation : mActivePresentations) {
            mSavedPresentationContents.put(presentation.mContents.displayId,
                    presentation.mContents);
            presentation.dismiss();
        }
        mActivePresentations.clear();
    }

    @Override
    protected void onStop() {
        super.onStop();
    }

    private void refreshDeviceList() {
        new AsyncTask<Void, Void, List<DeviceEntry>>() {
            @Override
            protected List<DeviceEntry> doInBackground(Void... params) {
                Log.d(TAG, "Refreshing device list ...");
                
                
                SystemClock.sleep(1000);
                final List<DeviceEntry> result = new ArrayList<DeviceEntry>();
                for (final UsbDevice device : mUsbManager.getDeviceList().values()) {
                	// Check to see if this is an ftdi device

                	if(device.getVendorId() == 1027)
                	{
                		Log.d(TAG, "Found usb device: " + device);
                        Log.d(TAG, "device: " + device.getDeviceName());
                        Log.d(TAG, "vendor: " + device.getVendorId());
                        
                        final List<UsbSerialDriver> drivers =
	                            UsbSerialProber.probeSingleDevice(mUsbManager, device);
	                    Log.d(TAG, "Found usb device: " + device);
	                    
	                    if (drivers.isEmpty()) {
	                        Log.d(TAG, "  - No UsbSerialDriver available.");
//	                        result.add(new DeviceEntry(device, null));
	                    } else {
	                        for (UsbSerialDriver driver : drivers) {
	                            Log.d(TAG, "  + " + driver + " " +device.getDeviceId());
	                            result.add(new DeviceEntry(device, driver));
	                        }
	                    }
                    }


                	if(device.getVendorId() == 5824)
                	{
                		Log.d(TAG, "Found usb device: " + device);
                        Log.d(TAG, "device: " + device.getDeviceName());
                        Log.d(TAG, "vendor: " + device.getVendorId());
                        
	                	final List<UsbSerialDriver> drivers =
	                            UsbSerialProber.probeSingleDevice(mUsbManager, device);
	                    Log.d(TAG, "Found usb device: " + device);
	                    
	                    if (drivers.isEmpty()) {
	                        Log.d(TAG, "  - No UsbSerialDriver available.");
	//                        result.add(new DeviceEntry(device, null));
	                    } else {
	                        for (UsbSerialDriver driver : drivers) {
	                            Log.d(TAG, "  + " + driver + " " +device.getDeviceId());
	                            result.add(new DeviceEntry(device, driver));
	                        }
	                    }
                	}
         
                }
                return result;
            }

            @Override
            protected void onPostExecute(List<DeviceEntry> result) {
                mEntries.clear();
                mEntries.addAll(result);
//                mAdapter.notifyDataSetChanged();
//                mProgressBarTitle.setText(
  //                      String.format("%s device(s) found",Integer.valueOf(mEntries.size())));
//                hideProgressBar();
                Log.d(TAG, "Done refreshing, " + mEntries.size() + " entries found.");
  
                if(mEntries.size() == 2)
                {
	                // After the list update if there are two USB devices in the array then launch the serialconsole
	                final DeviceEntry entry = mEntries.get(0);//position);
	                final UsbSerialDriver driver = entry.driver;
	                if (driver == null) {
	                    Log.d(TAG, "No driver.");
	                    return;
	                }
	
	                final DeviceEntry entry2 = mEntries.get(1);//posit\\ion);
	                final UsbSerialDriver driver2 = entry2.driver;
	                if (driver2 == null) {
	                    Log.d(TAG, "No driver.");
	                    return;
	                }
	                
	                
//	                final DeviceEntry entry3 = mEntries.get(2);//posit\\ion);
//	                final UsbSerialDriver driver3 = entry3.driver;
//	                if (driver3 == null) {
//	                    Log.d(TAG, "No driver.");
//	                    return;
//	                }
	                

	                //TODO
                	if(UsbConnected == false)
                	{
                		//StartUSB(driver, driver2, driver3);
                		StartUSB(driver, driver2);
                		
                	}
                }
            }

        }.execute((Void) null);
    }
    
    
//    private void StartUSB(UsbSerialDriver driver,UsbSerialDriver drivera) {
//        SerialActivity.StartUSB(this, driver, drivera);
//    }
    
    
    
    
    
    
    
    
    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putSparseParcelableArray(PRESENTATION_KEY,
                mSavedPresentationContents);
        outState.putInt(OPERATION_KEY, mOperation);
    }

    /**
     * Shows a {@link Presentation} on the specified display.
     */
    private void showPresentation(DDPresentation presentation) {
        presentation.show();
        presentation.setOnDismissListener(mOnDismissListener);
        mActivePresentations.add(presentation);
        

 
 
    }

    /**
     * Hides a {@link Presentation} on the specified display.
     */
    private void hidePresentation(int displayId) {
        DDPresentation presentation = null;
        for (DDPresentation tempPresentation : mActivePresentations) {
            if (tempPresentation.mContents.displayId == displayId) {
                presentation = tempPresentation;
                break;
            }
        }
        if (presentation == null) {
            return;
        }

        Log.d(TAG, "Dismissing presentation on display #" + displayId + ".");
        presentation.dismiss();
        mActivePresentations.remove(presentation);
    }

    private void hideAllSecondaryPresentations() {
        for (int i = 0; i < mDisplayListAdapter.getCount(); i++) {
            Display display = mDisplayListAdapter.getItem(i);
            hidePresentation(display.getDisplayId());
        }
    }

    /**
     * Listens for displays to be added, changed or removed. We use it to update
     * the list and show a new {@link Presentation} when a display is connected.
     *
     * Note that we don't bother dismissing the {@link Presentation} when a
     * display is removed, although we could. The presentation API takes care of
     * doing that automatically for us.
     */
    private final DisplayManager.DisplayListener mDisplayListener = new DisplayManager.DisplayListener() {
        @Override
        public void onDisplayAdded(int displayId) {
            Log.d(TAG, "Display #" + displayId + " added.");
            mDisplayListAdapter.updateContents();
        }

        @Override
        public void onDisplayChanged(int displayId) {
            Log.d(TAG, "Display #" + displayId + " changed.");
            mDisplayListAdapter.updateContents();
        }

        @Override
        public void onDisplayRemoved(int displayId) {
            Log.d(TAG, "Display #" + displayId + " removed.");
            mDisplayListAdapter.updateContents();
            hidePresentation(displayId);
            // remove display from selected
            for (Display display : mSelectedExtDisplayList) {
                if (display.getDisplayId() == displayId) {
                    mSelectedExtDisplayList.remove(display);
                    break;
                }
            }
//UPDATED removed            

            if (mSelectedExtDisplayList.isEmpty()) {
                setPrimaryFragment();
                mEnableExternalDisplayCheckBox.setChecked(false);
            }

        }
    };

    /**
     * Listens for when presentations are dismissed.
     */
    private final DialogInterface.OnDismissListener mOnDismissListener = new DialogInterface.OnDismissListener() {
        @Override
        public void onDismiss(DialogInterface dialog) {
            DDPresentation presentation = (DDPresentation) dialog;
            int displayId = presentation.getDisplay().getDisplayId();
            Log.d(TAG, "Presentation on display #" + displayId
                    + " was dismissed.");
            mActivePresentations.remove(presentation);
            mDisplayListAdapter.notifyDataSetChanged();
        }
    };

    /**
     * List adapter. Shows information about all displays.
     */
    private final class DisplayListAdapter extends ArrayAdapter<Display> {

        public DisplayListAdapter(Context context) {
            super(context, R.layout.presentation_list_item);
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            final View v;
            if (convertView == null) {
                v = ((Activity) getContext()).getLayoutInflater().inflate(
                        R.layout.presentation_list_item, null);
            } else {
                v = convertView;
            }

            final Display display = getItem(position);
            final int displayId = display.getDisplayId();

            TextView tv = (TextView) v.findViewById(R.id.display_id);
            tv.setText(v
                    .getContext()
                    .getResources()
                    .getString(R.string.presentation_display_id_text,
                            displayId, display.getName()));

            CheckBox cb = (CheckBox) v.findViewById(R.id.checkbox_presentation);
            cb.setOnCheckedChangeListener(MainActivity.this);
            cb.setTag(display);

            Button info = (Button) v.findViewById(R.id.info);
            info.setOnClickListener(new View.OnClickListener() {

                @Override
                public void onClick(View v) {
                    Context context = v.getContext();
                    AlertDialog.Builder builder = new AlertDialog.Builder(
                            context);
                    Resources r = context.getResources();
                    AlertDialog alert = builder
                            .setTitle(
                                    r.getString(
                                            R.string.presentation_alert_info_text,
                                            displayId))
                            .setMessage(display.toString())
                            .setNeutralButton(
                                    R.string.presentation_alert_dismiss_text,
                                    new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(
                                                DialogInterface dialog,
                                                int which) {
                                            dialog.dismiss();
                                        }
                                    }).create();
                    alert.show();
                }
            });

            return v;
        }

        /**
         * Update the contents of the display list adapter to show information
         * about all current displays.
         */
        public void updateContents() {
            clear();

            String displayCategory = getDisplayCategory();
            Display[] displays = mDisplayManager.getDisplays(displayCategory);
            addAll(displays);

            Log.d(TAG, "There are currently " + displays.length
                    + " displays connected.");
            isSingleDisplay = (displays.length == 0 ? true : false);
            for (Display display : displays) {
                Log.d(TAG, "  " + display);
            }
            
            
        }

        private String getDisplayCategory(){
            return DisplayManager.DISPLAY_CATEGORY_PRESENTATION;
        }
    }

    protected void initOperationModeSpinner(Spinner spinner) {
        ArrayAdapter<CharSequence> viewModeAdapter = ArrayAdapter
                .createFromResource(this, R.array.operations,
                        android.R.layout.simple_spinner_item);
        viewModeAdapter
                .setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(viewModeAdapter);
        spinner.setOnItemSelectedListener(mOperationListener);
        spinner.setSelection(mOperation);
    }

    private OnItemSelectedListener mOperationListener = new OnItemSelectedListener() {
        @Override
        public void onItemSelected(AdapterView<?> parent, View view, int pos,
                long id) {
            if (mOperation != pos) {
                mOperation = pos;
                setPrimaryFragment();
                updateSecondDisplay();
            }
        }

        @Override
        public void onNothingSelected(AdapterView<?> parent) {
        }
    };

    /**
     * Set the fragment to show on primary display
     */
    private void setPrimaryFragment() {
        FragmentManager fm = getFragmentManager();
        FragmentTransaction ft = fm.beginTransaction();
        if (mPrimaryFragment != null) {
            PrimaryFragment newFragment = getPrimaryFragment();
            if (mPrimaryFragment == newFragment) {
                throw new IllegalStateException("getPrimaryFragment() "
                        + "should return new Fragment instance on each call");
            }
            mPrimaryFragment = newFragment;
//UPDATED
//            ft.replace(R.id.primary_holder, mPrimaryFragment);
            ft.replace(R.id.webviewdpi, mPrimaryFragment);
        } else {
            mPrimaryFragment = getPrimaryFragment();
//UPDATED
//            ft.add(R.id.primary_holder, mPrimaryFragment);
            ft.add(R.id.webviewdpi, mPrimaryFragment);
        }

        if (mSelectedExtDisplayList == null) {
            mSelectedExtDisplayList = new ArrayList<Display>();
        }
        mPrimaryFragment.setExtDispList(mSelectedExtDisplayList);
        ft.commit();
    }

    /**
     * Get the fragment to show on primary display
     */
    private PrimaryFragment getPrimaryFragment() {
        switch (mOperation) {
        case OPERATION_HELLO:
            return new FragmentStub();
        case OPERATION_GRAPHICS:
            return new GraphicControllerFragment();
        case OPERATION_GRAPHICS_GL:
            return new FragmentStub();
        case OPERATION_VIDEO:
            return new PrimaryVideoFragment();
        case OPERATION_PHOTO:
            return new PrimaryPhotoFragment();
        case OPERATION_GAME:
            return new GameControlFragment();
        case OPERATION_TRIPLE_DISP_VIDEO:
            return new PrimaryVideoFragment();
        }

        throw new IllegalArgumentException("Fragment for operation "
                + mOperation + " not specified");
    }

    private void updateSecondDisplay() {
        hideAllSecondaryPresentations();
        if (isSingleDisplay || mSelectedExtDisplayList == null
                || mSelectedExtDisplayList.isEmpty()) {
            return;
        }

        // If there are more than one displays connected
        // we can show two videos on separate displays
        if (mOperation == OPERATION_VIDEO && mSelectedExtDisplayList.size() > 1) {
            mOperation = OPERATION_TRIPLE_DISP_VIDEO;
        }

        PresentationContents pContents;

        switch (mOperation) {
        case OPERATION_HELLO:
            pContents = new PresentationContents(
                    HelloPresentation.class.getCanonicalName(),
                    mSelectedExtDisplayList.get(0).getDisplayId());
            showPresentation(new HelloPresentation(this,
                    mSelectedExtDisplayList.get(0), pContents));
            break;
        case OPERATION_GRAPHICS:
            pContents = new PresentationContents(
                    GraphicPresentation.class.getCanonicalName(),
                    mSelectedExtDisplayList.get(0).getDisplayId());
            showPresentation(new GraphicPresentation(this,
                    mSelectedExtDisplayList.get(0), pContents));
            break;
        case OPERATION_GRAPHICS_GL:
            pContents = new PresentationContents(
                    OpenGLPresentation.class.getCanonicalName(),
                    mSelectedExtDisplayList.get(0).getDisplayId());
            showPresentation(new OpenGLPresentation(this,
                    mSelectedExtDisplayList.get(0), pContents));
            break;
        case OPERATION_VIDEO:
            pContents = new PresentationContents(
                    VideoPresentation.class.getCanonicalName(),
                    mSelectedExtDisplayList.get(0).getDisplayId());
            showPresentation(new VideoPresentation(this,
                    mSelectedExtDisplayList.get(0), pContents));
            break;
        case OPERATION_PHOTO:
            pContents = new PresentationContents(
                    PhotoPresentation.class.getCanonicalName(),
                    mSelectedExtDisplayList.get(0).getDisplayId());
            showPresentation(new PhotoPresentation(this,
                    mSelectedExtDisplayList.get(0), pContents));
            break;
        case OPERATION_GAME:
            pContents = new PresentationContents(
                    GamePresentation.class.getCanonicalName(),
                    mSelectedExtDisplayList.get(0).getDisplayId());
            showPresentation(new GamePresentation(this,
                    mSelectedExtDisplayList.get(0), pContents));
            break;
        case OPERATION_TRIPLE_DISP_VIDEO:
            // Create two separate presentations
            pContents = new PresentationContents(
                    VideoPresentation.class.getCanonicalName(),
                    mSelectedExtDisplayList.get(0).getDisplayId());
            SingleVideoPresentation vid0 = new SingleVideoPresentation(this,
                    mSelectedExtDisplayList.get(0), pContents);
            vid0.setPlayer(0);
            showPresentation(vid0);
            pContents = new PresentationContents(
                    VideoPresentation.class.getCanonicalName(),
                    mSelectedExtDisplayList.get(1).getDisplayId());
            SingleVideoPresentation vid1 = new SingleVideoPresentation(this,
                    mSelectedExtDisplayList.get(1), pContents);
            vid1.setPlayer(1);
            showPresentation(vid1);
            break;
        default:
            throw new IllegalArgumentException("Presentation for operation "
                    + mOperation + " not specified");
        }
        
    }

    private DDPresentation buildPresentation(PresentationContents contents,
            Display display) {
        String className = contents.presentationClassName;
        if (className.equals(HelloPresentation.class.getCanonicalName())) {
            return new HelloPresentation(this, display, contents);
        } else if (className.equals(GraphicPresentation.class
                .getCanonicalName())) {
            return new GraphicPresentation(this, display, contents);
        } else if (className
                .equals(OpenGLPresentation.class.getCanonicalName())) {
            return new OpenGLPresentation(this, display, contents);
        } else if (className.equals(VideoPresentation.class.getCanonicalName())) {
            return new VideoPresentation(this, display, contents);
        } else if (className.equals(PhotoPresentation.class.getCanonicalName())) {
            return new PhotoPresentation(this, display, contents);
        } else if (className.equals(GamePresentation.class.getCanonicalName())) {
            return new GamePresentation(this, display, contents);
        } else {
            throw new IllegalArgumentException("Presentation class not found: "
                    + className);
        }
    }

    private void selectDisplay() {
        if (mSelectedExtDisplayList == null) {
            mSelectedExtDisplayList = new ArrayList<Display>();
        } else {
            mSelectedExtDisplayList.clear();
        }
        if (mDisplayListAdapter.isEmpty()) {
            Toast.makeText(MainActivity.this, R.string.no_displays_connected,
                    Toast.LENGTH_SHORT).show();
            //UPDATED removed
            mEnableExternalDisplayCheckBox.setChecked(false);
            return;
        }
        
        
        
        //UPDATED - added to force the second display to be presented
        
        final Display display = mDisplayListAdapter.getItem(0);
        mSelectedExtDisplayList.add(display);
        setPrimaryFragment();
        updateSecondDisplay();
        
        
        
        
        
  //UPDATED      
/*        
        ListView popupListDisp = new ListView(MainActivity.this);
        popupListDisp.setAdapter(mDisplayListAdapter);
        AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
        builder.setTitle(R.string.select_display_title)
                .setMessage(R.string.select_display_message)
                .setPositiveButton(R.string.accept,
                        new DialogInterface.OnClickListener() {

                            @Override
                            public void onClick(DialogInterface dialog,
                                    int which) {
                                dialog.dismiss();
                                if (!mSelectedExtDisplayList.isEmpty()) {
                                    setPrimaryFragment();
                                    updateSecondDisplay();
                                } else {
                                    Toast.makeText(MainActivity.this,
                                            R.string.no_displays_selected,
                                            Toast.LENGTH_SHORT).show();
                                    
                                    //UPDATED removed
                                    mEnableExternalDisplayCheckBox.setChecked(false);
                                }
                            }
                        })
                .setNegativeButton(R.string.cancel,
                        new DialogInterface.OnClickListener() {

                            @Override
                            public void onClick(DialogInterface dialog,
                                    int which) {
                                mSelectedExtDisplayList.clear();
                                
                                //UPDATED removed
                                mEnableExternalDisplayCheckBox
                                        .setChecked(false);
                                dialog.dismiss();
                            }
                        }).setView(popupListDisp).setCancelable(false).create()
                .show();
*/                
    }

    
    /**
     * Called when the show all displays checkbox is toggled or when an item in
     * the list of displays is checked or unchecked.
     */
    
    @Override
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
//UPDATED removed
    	
    	if (buttonView.equals(mEnableExternalDisplayCheckBox)) {

        	// Show all displays checkbox was toggled.
            if (!isChecked) {
                hideAllSecondaryPresentations();
                mSelectedExtDisplayList.clear();
                setPrimaryFragment();
            } else {
                mDisplayListAdapter.updateContents();
                selectDisplay();
            }
        } else {
            // Display item checkbox was toggled.
            Display display = (Display) buttonView.getTag();
            
            if (isChecked) {
                if (!mSelectedExtDisplayList.contains(display)) {
                	
                	
                    mSelectedExtDisplayList.add(display);

                }
            } else {
                mSelectedExtDisplayList.remove(display);
            }
        }
        
    }

    /**
     * Re-send received message to fragment Google insists on avoiding direct
     * fragment-to-fragment communication)
     */
    @Override
    public void onCommand(Bundle bnd) {
        int displayId = bnd.getInt(OnCommandListener.DISPLAY_ID, -1);

        DDPresentation receiverFrag = null;

        for (DDPresentation presentation : mActivePresentations) {
            if (presentation.mContents.displayId == displayId) {
                receiverFrag = presentation;
                break;
            }
        }

        if (receiverFrag != null) {
            receiverFrag.onCommand(bnd);
        } else {
            Log.e(TAG, "Receiver fragment for display " + displayId
                    + " not initialized");
        }
    }
    
    
    
    private void stopIoManager() {
        if (mSerialIoManager != null) {
            Log.i(TAG, "Stopping io manager ..");
            mSerialIoManager.stop();
            mSerialIoManager = null;
        }
        
        if (mSerialIoManager2 != null) {
            Log.i(TAG, "Stopping io manager ..");
            mSerialIoManager2.stop();
            mSerialIoManager2 = null;
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

    private void StartUSB(UsbSerialDriver driver,UsbSerialDriver driver2) {
   	UsbConnected = true;
   	
   	sDriver = driver;
       sDriver2 = driver2;
       
       Log.d(TAG, "Resumed, sDriver=" + sDriver);
       if (sDriver == null) {
//           mTitleTextView.setText("No serial device.");
       } else {
           try {
               sDriver.open();
               sDriver.setParameters(115200, 8, UsbSerialDriver.STOPBITS_1, UsbSerialDriver.PARITY_NONE);
           } catch (IOException e) {
               Log.e(TAG, "Error setting up device: " + e.getMessage(), e);
//               mTitleTextView.setText("Error opening device: " + e.getMessage());
               try {
                   sDriver.close();
               } catch (IOException e2) {
                   // Ignore.
               }
               sDriver = null;
               return;
           }
//           mTitleTextView.setText("Serial device: " + sDriver.getClass().getSimpleName());
       }
       
       if (sDriver2 == null) {
//           mTitleTextView.setText("No serial device.");
       } else {
           try {
               sDriver2.open();
               sDriver2.setParameters(115200, 8, UsbSerialDriver.STOPBITS_1, UsbSerialDriver.PARITY_NONE);
           } catch (IOException e) {
               Log.e(TAG, "Error setting up device: " + e.getMessage(), e);
//               mTitleTextView.setText("Error opening device: " + e.getMessage());
               try {
                   sDriver2.close();
               } catch (IOException e2) {
                   // Ignore.
               }
               sDriver2 = null;
               return;
           }
//           mTitleTextView.setText("Serial device: " + sDriver.getClass().getSimpleName());
       }

/*       
       if (sDriver3 == null) {
//         mTitleTextView.setText("No serial device.");
     } else {
         try {
             sDriver3.open();
             sDriver3.setParameters(115200, 8, UsbSerialDriver.STOPBITS_1, UsbSerialDriver.PARITY_NONE);
         } catch (IOException e) {
             Log.e(TAG, "Error setting up device: " + e.getMessage(), e);
//             mTitleTextView.setText("Error opening device: " + e.getMessage());
             try {
                 sDriver3.close();
             } catch (IOException e2) {
                 // Ignore.
             }
             sDriver3 = null;
             return;
         }
//         mTitleTextView.setText("Serial device: " + sDriver.getClass().getSimpleName());
     }
  */     
       onDeviceStateChange();
       
       //Initialize the GazeDetection USB Channel
       
       
 //      startIoManager();
    }
    
    private void onDeviceStateChange() {
        stopIoManager();
        startIoManager();
    }
    
    
/*    
    private void parseGazeData(byte[] data) {
    	 
    	
    }
*/
    private void updateReceivedData(byte[] data) {

    	byte[] PwmData = {5};
    	
//        JSONObject TouchPad = new JSONObject();

/* I Believe this was original test code.  Can probably be removed        
        try {
            TouchPad.put("Button", data[0]);
          
            
        } catch (JSONException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }        
*/
        if(mDeviceConfiguration == INPUT_DEVICE)
        {
	        // The steering controller sends uart data commands in increments of 4 data bytes
	        // If four bytes are received then most likely it is from the steering wheel controller
	        if(data.length == 4)
	        {
	        	steeringClient.ProcessMessage(data);
	        }
	        
	        else if(data.length == 8)
	        {
	        	touchClient.ProcessMessage(data);
	        }
        }
        else if(mDeviceConfiguration == GAZE_DEVICE)
        {
        	if(data.length == 1)
        	{
        		
        		switch(data[0])
        		{
        			case '1':
        		
        				PwmData[0] = 10;
        				
        			break;

        			case '2':
                		
        				PwmData[0] = 20;
        				
        			break;

        			case '3':
                		
        				PwmData[0] = 30;
        				
        			break;

        			case '4':
                		
        				PwmData[0] = 40;
        				
        			break;

        			case '5':
                		
        				PwmData[0] = 50;
        				
        			break;

        			case '6':
                		
        				PwmData[0] = 60;
        				
        			break;

        			case '7':
                		
        				PwmData[0] = 70;
        				
        			break;

        			case '8':
                		
        				PwmData[0] = 80;
        				
        			break;

        			case '9':
                		
        				PwmData[0] = 90;
        				
        			break;

        			case '0':
                		
        				PwmData[0] = 0;
        				
        			break;

        			default:
        				
        			break;
        		}
//        		PwmData[0] = data[0];
        		
        		try {
					sDriver.write(PwmData, 1000);
					sDriver2.write(PwmData, 1000);
					
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
        		
        	}
        }
    }
}

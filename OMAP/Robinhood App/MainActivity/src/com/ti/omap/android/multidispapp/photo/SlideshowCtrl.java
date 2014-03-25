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
package com.ti.omap.android.multidispapp.photo;

import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.locks.ReentrantLock;

import android.app.Activity;
import android.content.Context;
import android.database.Cursor;
import android.graphics.BitmapFactory;
import android.graphics.BitmapFactory.Options;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.v4.content.CursorLoader;

import com.ti.omap.android.multidispapp.OnCommandListener;

public class SlideshowCtrl {

    final public static int SLIDESHOW_PERIOD = 1500;

    public interface SlideshowListener {
        public final static int UNDEFINED = -1;
        public final static int INITED = 0;
        public final static int STOPPED = 1;
        public final static int STARTED = 2;
        public final static int CANT_START = 3;

        public void onStateChanged(int slideshowState);
    }

    final private SlideshowListener mListener;
    final private Context mContext;
    private ReentrantLock mLock = new ReentrantLock();
    private int mState = SlideshowListener.UNDEFINED;
    private Cursor mImagesCursor;
    private int[] mCorrectPositions = null;
    private int mCorrectPhotosCount;
    private Timer mTimer;
    private int mShownPosition;

    private OnCommandListener mCommandCallback;

    public SlideshowCtrl(SlideshowListener listener, Activity activity) {
        // This makes sure that the container activity has implemented
        // the callback interface. If not, it throws an exception
        try {
            mCommandCallback = (OnCommandListener) activity;
        } catch (ClassCastException e) {
            throw new ClassCastException(activity.toString()
                    + " must implement OnHeadlineSelectedListener");
        }

        mListener = listener;
        mContext = activity;
    }

    private Cursor buildPhotoCursor() {
        Uri uri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
        CursorLoader loader = new CursorLoader(mContext, uri, null, null, null,
                null);
        Cursor cursor = loader.loadInBackground();
        return cursor;
    }

    public void start() {
        if (mState == SlideshowListener.STARTED) {
            return;
        }

        mLock.lock();
        try {
            if (mImagesCursor == null || mImagesCursor.isClosed()) {
                mImagesCursor = buildPhotoCursor();
                updateCorrectFotosList();
                mState = SlideshowListener.INITED;
            }
        } finally {
            mLock.unlock();
        }
        if (mState == SlideshowListener.INITED) {
            mListener.onStateChanged(mState);
        }

        mLock.lock();
        try {
            startSlideshow();
        } finally {
            mLock.unlock();
        }

        mListener.onStateChanged(mState);
    }

    /**
     * Looks through images in cursor and add position of one with correct size
     * (not zero and not exceeds limit) to array mCorrectPositions[].</br> Also
     * sets to number of these items to mCorrectPhotosCount.</br> Array size may
     * exceeds mCorrectPhotosCount value.
     */
    private void updateCorrectFotosList() {
        int size = mImagesCursor != null ? mImagesCursor.getCount() : 0;
        if (size == 0) {
            return;
        }

        // avoid long photo list loading
        if (size > 10) {
            size = 10;
        }

        mCorrectPositions = new int[size];
        mCorrectPhotosCount = 0;

        BitmapFactory.Options options = new Options();
        options.inJustDecodeBounds = true;
        int index = 0;

        mImagesCursor.moveToFirst();
        while (!mImagesCursor.isAfterLast() && index < size) {
            String path = mImagesCursor.getString(mImagesCursor
                    .getColumnIndex(MediaStore.Images.Media.DATA));
            options.outHeight = 0;
            options.outWidth = 0;
            BitmapFactory.decodeFile(path, options);
            int imageSize = options.outHeight * options.outWidth;
            if (imageSize > 0) {
                mCorrectPositions[index] = mImagesCursor.getPosition();
                ++index;
            }
            mImagesCursor.moveToNext();
        }
        mCorrectPhotosCount = index;
    }

    private void startSlideshow() {
        if (mCorrectPhotosCount <= 0) {
            mState = SlideshowListener.CANT_START;
            return;
        }
        if (mTimer != null) {
            mTimer.cancel();
        }
        mTimer = new Timer();
        mShownPosition = 0;
        mTimer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                int photoPosition = mCorrectPositions[mShownPosition];
                ++mShownPosition;
                boolean isOk = showPhoto(photoPosition);
                if (mShownPosition == mCorrectPhotosCount || !isOk) {
                    stop();
                }
            }
        }, 1000, SLIDESHOW_PERIOD);
        mState = SlideshowListener.STARTED;
    }

    private boolean showPhoto(int position) {
        if (mImagesCursor == null || mImagesCursor.getCount() < position) {
            return false;
        }

        mImagesCursor.moveToPosition(position);
        String path = mImagesCursor.getString(mImagesCursor
                .getColumnIndex(MediaStore.Images.Media.DATA));
        Uri photoUri = Uri.parse(path);

        Bundle cmd = new Bundle();
        cmd.putInt(PhotoCmdDefines.CMD, PhotoCmdDefines.CMD_SHOW_PHOTO);
        cmd.putParcelable(PhotoCmdDefines.SLIDESHOW_URI, photoUri);

        mCommandCallback.onCommand(cmd);

        return true;
    }

    public void stop() {
        mLock.lock();
        try {
            if (mImagesCursor != null) {
                mImagesCursor.close();
                mImagesCursor = null;
            }

            if (mTimer != null) {
                mTimer.cancel();
                mTimer.purge();
                mTimer = null;
            }

            mState = SlideshowListener.STOPPED;
            mListener.onStateChanged(mState);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            mLock.unlock();
        }
    }

    @Override
    protected void finalize() throws Throwable {
        try {
            if (mImagesCursor != null) {
                mImagesCursor.close();
            }
            if (mTimer != null) {
                mTimer.cancel();
            }
        } finally {
            super.finalize();
        }
    }

}

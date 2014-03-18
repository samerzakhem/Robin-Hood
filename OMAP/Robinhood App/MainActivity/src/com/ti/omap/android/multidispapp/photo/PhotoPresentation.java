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

import java.lang.ref.WeakReference;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.view.Display;
import android.widget.ImageView;

import com.ti.omap.android.multidispapp.DDPresentation;
import com.ti.omap.android.multidispapp.PresentationContents;
import com.ti.omap.android.multidispapp.R;

@SuppressWarnings("unused")
public class PhotoPresentation extends DDPresentation {

    final public static int TARGET_SIZE = 512;

    private ImageView mPhotoView;
    private WeakReference<Bitmap> mBitmapPhoto;

    // @Override
    public PhotoPresentation(Context outerContext, Display display,
            PresentationContents pContents) {
        super(outerContext, display, pContents);
        setContentView(R.layout.photo);

        mPhotoView = (ImageView) findViewById(R.id.photo_image);
    }

    public void showPhoto(final Uri photoUri) {
        if (photoUri == null || mPhotoView == null) {
            return;
        }

        mPhotoView.post(new Runnable() {

            @Override
            public void run() {
                Bitmap bitmap = getBitmapPhoto(photoUri);
                mPhotoView.setImageBitmap(bitmap);
            }
        });
    }

    @Override
    public void onCommand(Bundle cmd) {
        int command = cmd.getInt(PhotoCmdDefines.CMD,
                PhotoCmdDefines.CMD_UNDEFINED);
        switch (command) {
        case PhotoCmdDefines.CMD_SHOW_PHOTO: {
            Uri photoUri = cmd.getParcelable(PhotoCmdDefines.SLIDESHOW_URI);
            showPhoto(photoUri);
        }
            break;
        default:
            super.onCommand(cmd);
        }
    }

    public Bitmap getBitmapPhoto(Uri photoUri) {
        // First decode with inJustDecodeBounds=true to check dimensions
        final BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeFile(photoUri.toString(), options);

        // Calculate inSampleSize
        options.inSampleSize = PhotoGalleryCtrl.calculateInSampleSize(options,
                TARGET_SIZE, TARGET_SIZE);

        // Decode bitmap with inSampleSize set
        options.inJustDecodeBounds = false;
        Bitmap pre = BitmapFactory.decodeFile(photoUri.toString(), options);
        Bitmap resultBitmap;
        if (pre == null) {
            return null;
        } else {
            int preH = pre.getHeight();
            int preW = pre.getWidth();
            if (preH > TARGET_SIZE || preW > TARGET_SIZE) {
                // rescale
                double scale = (double) TARGET_SIZE / Math.max(preH, preW);
                int newH = (int) (preH * scale + 0.5);
                int newW = (int) (preW * scale + 0.5);
                resultBitmap = Bitmap
                        .createScaledBitmap(pre, newW, newH, false);
                pre.recycle();
                pre = null;
            } else {
                resultBitmap = pre;
            }
        }
        mBitmapPhoto = new WeakReference<Bitmap>(resultBitmap);
        return resultBitmap;
    }
}

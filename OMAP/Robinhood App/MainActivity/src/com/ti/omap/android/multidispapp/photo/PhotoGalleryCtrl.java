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

import android.app.Activity;
import android.content.Context;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.provider.MediaStore;
import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v4.view.ViewPager.OnPageChangeListener;
import android.util.SparseArray;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import com.ti.omap.android.multidispapp.R;

public class PhotoGalleryCtrl implements OnPageChangeListener {

    final public static int TARGET_SIZE = 512;
    final private static int MAX_PHOTO_COUNT = 10;
    @SuppressWarnings("unused")
    final private static String TAG = "PhotoGalleryCtrl";

    public interface PhotoChangeListener {
        public void onPhotoChange(TPhoto photoUri);
    }

    final public static class TPhoto {
        public Uri mUri;
        public String mTitle;
        public int mHeight;
        public int mWidth;
        public int mSize;
        public long mDateTaken;
        @SuppressWarnings("unused")
        private WeakReference<Bitmap> mBitmapPhoto;

        public Bitmap getBitmapPhoto() {
            // First decode with inJustDecodeBounds=true to check dimensions
            final BitmapFactory.Options options = new BitmapFactory.Options();
            options.inJustDecodeBounds = true;
            BitmapFactory.decodeFile(mUri.toString(), options);

            // Calculate inSampleSize
            options.inSampleSize = calculateInSampleSize(options, TARGET_SIZE,
                    TARGET_SIZE);

            // Decode bitmap with inSampleSize set
            options.inJustDecodeBounds = false;
            Bitmap pre = BitmapFactory.decodeFile(mUri.toString(), options);
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
                    resultBitmap = Bitmap.createScaledBitmap(pre, newW, newH,
                            false);
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

    public static int calculateInSampleSize(BitmapFactory.Options options,
            int reqWidth, int reqHeight) {
        // Raw height and width of image
        final int height = options.outHeight;
        final int width = options.outWidth;
        int inSampleSize = 1;

        if (height > reqHeight || width > reqWidth) {
            if (width > height) {
                inSampleSize = Math.round((float) height / (float) reqHeight);
            } else {
                inSampleSize = Math.round((float) width / (float) reqWidth);
            }
        }
        return inSampleSize;
    }

    final private PhotoChangeListener mListener;
    final private ViewPager mViewPager;
    final private PreviewsAdapter mAdapter;
    private int mCurrentPhotoIndex;
    private TPhoto mCurrentPhoto;
    private Cursor mPhotoCursor;
    private SparseArray<WeakReference<TPhoto>> mWeakPhotos;

    public PhotoGalleryCtrl(ViewPager viewPager, PhotoChangeListener listener) {
        mWeakPhotos = new SparseArray<WeakReference<TPhoto>>();
        mListener = listener;
        mViewPager = viewPager;
        mAdapter = new PreviewsAdapter();
        viewPager.setOffscreenPageLimit(1);
        viewPager.setAdapter(mAdapter);
        viewPager.setPageMarginDrawable(new ColorDrawable(Color.WHITE));
        viewPager.setPageMargin(3);
        viewPager.setOnPageChangeListener(this);
    }

    public void close() {
        closeCursor();
    }

    public void init(Activity activity) {
        try {
            closeCursor();
            mPhotoCursor = buildPhotoCursor(activity);
            updatePhoto(0);
        } catch (Exception e) {
            closeCursor();
        }
    }

    private Cursor buildPhotoCursor(Activity activity) {
        String[] proj = { MediaStore.Images.Media._ID,
                MediaStore.Images.Media.DATA, MediaStore.Images.Media.HEIGHT,
                MediaStore.Images.Media.WIDTH, MediaStore.Images.Media.SIZE,
                MediaStore.Images.Media.DATE_TAKEN,
                MediaStore.Images.Media.DISPLAY_NAME,
                MediaStore.Images.Media.TITLE,
                MediaStore.Images.Media.MIME_TYPE, };
        return mViewPager
                .getContext()
                .getContentResolver()
                .query(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, proj,
                        null, null, null);
    }

    private void updatePhoto(int position) {
        if (mPhotoCursor == null || position < 0 || position >= getPhotoCount()) {
            return;
        }
        TPhoto photo = getPhoto(position);
        if (photo == null) {
            return;
        }
        if (mCurrentPhoto == null || mCurrentPhoto.mUri == null
                || 0 != mCurrentPhoto.mUri.compareTo(photo.mUri)) {
            mCurrentPhoto = photo;
            mCurrentPhotoIndex = position;
            mListener.onPhotoChange(photo);
        }
    }

    public TPhoto getPhoto(int position) {
        if (mPhotoCursor == null || position < 0 || position >= getPhotoCount()) {
            return null;
        }

        // check whether photo is still cached
        WeakReference<TPhoto> weakPhoto = mWeakPhotos.get(Integer
                .valueOf(position));
        TPhoto photo = (weakPhoto != null ? weakPhoto.get() : null);
        if (photo != null) {
            return photo;
        }

        synchronized (mPhotoCursor) {
            mPhotoCursor.moveToPosition(position);
            return makePhoto();
        }
    }

    public TPhoto getNextPhoto() {
        if (mCurrentPhotoIndex >= getPhotoCount() - 1) {
            return null;
        }
        updatePhoto(mCurrentPhotoIndex + 1);
        return mCurrentPhoto;
    }

    public TPhoto getPreviousPhoto() {
        if (mCurrentPhotoIndex == 0) {
            return null;
        }
        updatePhoto(mCurrentPhotoIndex - 1);
        return mCurrentPhoto;
    }

    private TPhoto makePhoto() {
        TPhoto photo = new TPhoto();
        String data = mPhotoCursor.getString(mPhotoCursor
                .getColumnIndex(MediaStore.Images.Media.DATA));
        photo.mUri = Uri.parse(data);
        photo.mHeight = mPhotoCursor.getInt(mPhotoCursor
                .getColumnIndex(MediaStore.Images.Media.HEIGHT));
        photo.mWidth = mPhotoCursor.getInt(mPhotoCursor
                .getColumnIndex(MediaStore.Images.Media.WIDTH));
        photo.mSize = mPhotoCursor.getInt(mPhotoCursor
                .getColumnIndex(MediaStore.Images.Media.SIZE));
        photo.mDateTaken = mPhotoCursor.getLong(mPhotoCursor
                .getColumnIndex(MediaStore.Images.Media.DATE_TAKEN));
        photo.mTitle = mPhotoCursor.getString(mPhotoCursor
                .getColumnIndex(MediaStore.Images.Media.TITLE));
        return photo;
    }

    public TPhoto getCurrentPhoto() {
        return mCurrentPhoto;
    }

    public int getPhotoCount() {
        if (mPhotoCursor == null) {
            return 0;
        }
        // leave 10 items to reduce preview loading time
        int cursorFound = mPhotoCursor.getCount();

        return cursorFound > MAX_PHOTO_COUNT ? MAX_PHOTO_COUNT : cursorFound;
    }

    @Override
    public void onPageScrolled(int position, float positionOffset,
            int positionOffsetPixels) {
    }

    @Override
    public void onPageScrollStateChanged(int state) {
    }

    @Override
    public void onPageSelected(int position) {
        updatePhoto(position);
    }

    private class PreviewsAdapter extends PagerAdapter {
        final private Context mContext;
        final private LayoutInflater mInflater;

        public PreviewsAdapter() {
            mContext = mViewPager.getContext();
            mInflater = (LayoutInflater) mContext
                    .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        }

        @Override
        public Object instantiateItem(ViewGroup container, final int position) {
            View layout = mInflater.inflate(R.layout.photo_stub, null);
            final ImageView imageView = (ImageView) layout
                    .findViewById(R.id.photo_stub_image);
            imageView.setImageResource(R.drawable.too_heavy);

            // load image async
            imageView.post(new Runnable() {

                @Override
                public void run() {
                    TPhoto photo = PhotoGalleryCtrl.this.getPhoto(position);
                    Bitmap bitmap = photo != null ? photo.getBitmapPhoto()
                            : null;
                    if (imageView != null) {
                        imageView.setImageBitmap(bitmap);
                    }
                }
            });

            container.addView(layout);
            return layout;
        }

        @Override
        public void destroyItem(ViewGroup container, int position, Object object) {
            container.removeView((View) object);
        }

        @Override
        public int getCount() {
            return getPhotoCount();
        }

        @Override
        public float getPageWidth(int position) {
            return 0.35f;
        }

        @Override
        public boolean isViewFromObject(View view, Object obj) {
            return view == obj;
        }

    }

    @Override
    protected void finalize() throws Throwable {
        try {
            closeCursor();
        } finally {
            super.finalize();
        }
    }

    private void closeCursor() {
        if (mPhotoCursor != null) {
            mPhotoCursor.close();
            mPhotoCursor = null;
        }
    }

}

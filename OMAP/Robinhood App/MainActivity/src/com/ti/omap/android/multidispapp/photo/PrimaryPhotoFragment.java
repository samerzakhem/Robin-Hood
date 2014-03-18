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

import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Date;

import android.app.Activity;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.support.v4.view.ViewPager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.ti.omap.android.multidispapp.DDHelper;
import com.ti.omap.android.multidispapp.OnCommandListener;
import com.ti.omap.android.multidispapp.PrimaryFragment;
import com.ti.omap.android.multidispapp.R;
import com.ti.omap.android.multidispapp.photo.PhotoGalleryCtrl.PhotoChangeListener;
import com.ti.omap.android.multidispapp.photo.PhotoGalleryCtrl.TPhoto;
import com.ti.omap.android.multidispapp.photo.SlideshowCtrl.SlideshowListener;

public class PrimaryPhotoFragment extends PrimaryFragment implements
        OnClickListener, PhotoChangeListener, SlideshowListener {

    final private static String sFormat = "yyyy.MM.dd HH:mm:ss";
    final private static Format sFormatter = new SimpleDateFormat(sFormat);

    private PhotoGalleryCtrl mGalleryCtrl;
    private SlideshowCtrl mSlideshowCtrl;
    private View mGeneralView;
    private ImageView mPreviewImage;
    private TextView mPreviewTitleView;
    private TextView mPreviewSizeView;
    private TextView mPreviewDateView;

    private OnCommandListener mCommandCallback;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.photo_controls, container, false);

        ViewPager viewPager = (ViewPager) view.findViewById(R.id.photo_gallery);
        mGalleryCtrl = new PhotoGalleryCtrl(viewPager, this);
        mSlideshowCtrl = new SlideshowCtrl(this, getActivity());
        mGeneralView = view;
        mPreviewImage = (ImageView) view.findViewById(R.id.photo_preview_image);
        mPreviewTitleView = (TextView) view
                .findViewById(R.id.photo_details_title);
        mPreviewSizeView = (TextView) view
                .findViewById(R.id.photo_details_size);
        mPreviewDateView = (TextView) view
                .findViewById(R.id.photo_details_date_taken);

        DDHelper.registerClickListener(R.id.photo_button_show, this, view);
        DDHelper.registerClickListener(R.id.photo_button_previous, this, view);
        DDHelper.registerClickListener(R.id.photo_button_next, this, view);
        DDHelper.registerClickListener(R.id.photo_button_start, this, view);
        DDHelper.registerClickListener(R.id.photo_button_stop, this, view);

        return view;
    }

    @Override
    public void onResume() {
        super.onResume();
        if (mGalleryCtrl != null) {
            mGalleryCtrl.init(getActivity());
            setSlideshowControlState(true);
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        if (mGalleryCtrl != null) {
            mGalleryCtrl.close();
            mGalleryCtrl = null;
        }
        if (mSlideshowCtrl != null) {
            mSlideshowCtrl.stop();
        }
    }

    @Override
    public void onPhotoChange(final TPhoto photo) {
        if (photo == null || mGeneralView == null) {
            return;
        }
        mGeneralView.post(new Runnable() {
            @Override
            public void run() {
                Bitmap dPhoto = photo != null ? photo.getBitmapPhoto() : null;
                if (dPhoto != null) {
                    mPreviewImage.setImageBitmap(dPhoto);
                } else {
                    mPreviewImage.setImageResource(R.drawable.too_heavy);
                }
                mPreviewTitleView.setText(photo.mTitle);
                mPreviewSizeView.setText(makeSizeString(photo));
                mPreviewDateView.setText(makeDate(photo.mDateTaken));
            }
        });
    }

    private String makeSizeString(TPhoto photo) {
        StringBuilder sb = new StringBuilder();
        sb.append(photo.mWidth);
        sb.append(" x ");
        sb.append(photo.mHeight);
        sb.append(" - ");
        sb.append(photo.mSize);
        sb.append(getActivity().getString(R.string._bytes));
        return sb.toString();
    }

    private String makeDate(long intDate) {
        String formattedDate = null;
        Date date = new Date(intDate);
        formattedDate = sFormatter.format(date);
        return formattedDate;
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);

        // This makes sure that the container activity has implemented
        // the callback interface. If not, it throws an exception
        try {
            mCommandCallback = (OnCommandListener) activity;
        } catch (ClassCastException e) {
            throw new ClassCastException(activity.toString()
                    + " must implement OnHeadlineSelectedListener");
        }
    }

    @Override
    public void onClick(View v) {
        int viewId = v.getId();
        switch (viewId) {
        case R.id.photo_button_show: {
            TPhoto photo = mGalleryCtrl.getCurrentPhoto();
            showExternalPhoto(photo);
        }
            break;
        case R.id.photo_button_previous: {
            TPhoto photo = mGalleryCtrl.getPreviousPhoto();
            showExternalPhoto(photo);
        }
            break;
        case R.id.photo_button_next: {
            TPhoto photo = mGalleryCtrl.getNextPhoto();
            showExternalPhoto(photo);
        }
            break;
        case R.id.photo_button_start:
            mSlideshowCtrl.start();
            break;
        case R.id.photo_button_stop:
            mSlideshowCtrl.stop();
            break;
        default:
            throw new IllegalStateException("Button click wasn't handled: id: "
                    + viewId);
        }
    }

    private void showExternalPhoto(TPhoto photo) {
        if (photo == null) {
            getActivity().runOnUiThread(new Runnable() {
                public void run() {
                    Toast.makeText(getActivity(), R.string.no_photo,
                            Toast.LENGTH_SHORT).show();
                }
            });
            return;
        }
        Bundle cmd = new Bundle();
        cmd.putInt(PhotoCmdDefines.CMD, PhotoCmdDefines.CMD_SHOW_PHOTO);
        cmd.putParcelable(PhotoCmdDefines.SLIDESHOW_URI, photo.mUri);
        cmd.putInt(OnCommandListener.DISPLAY_ID, getDisplayId(0));

        mCommandCallback.onCommand(cmd);
    }

    @Override
    public void onStateChanged(int slideshowState) {
        switch (slideshowState) {
        case SlideshowListener.INITED:
            break;
        case SlideshowListener.STARTED:
            getActivity().runOnUiThread(new Runnable() {
                public void run() {
                    Toast.makeText(getActivity(), R.string.start,
                            Toast.LENGTH_SHORT).show();
                }
            });
            setSlideshowControlState(false);
            break;
        case SlideshowListener.CANT_START:
            getActivity().runOnUiThread(new Runnable() {
                public void run() {
                    Toast.makeText(getActivity(),
                            R.string.cant_start_slideshow, Toast.LENGTH_SHORT)
                            .show();
                }
            });
            setSlideshowControlState(true);
            break;
        case SlideshowListener.STOPPED:
            getActivity().runOnUiThread(new Runnable() {
                public void run() {
                    Toast.makeText(getActivity(), R.string.stop,
                            Toast.LENGTH_SHORT).show();
                }
            });
            setSlideshowControlState(true);
            break;
        case SlideshowListener.UNDEFINED:
        default:
            break;
        }
    }

    private void setSlideshowControlState(final boolean enabled) {
        getActivity().runOnUiThread(new Runnable() {
            public void run() {
                Activity activity = getActivity();
                activity.findViewById(R.id.photo_button_show).setEnabled(
                        enabled);
                activity.findViewById(R.id.photo_button_previous).setEnabled(
                        enabled);
                activity.findViewById(R.id.photo_button_next).setEnabled(
                        enabled);
                activity.findViewById(R.id.photo_button_start).setEnabled(
                        enabled);
                activity.findViewById(R.id.photo_button_stop).setEnabled(
                        !enabled);
            }
        });
    }
}

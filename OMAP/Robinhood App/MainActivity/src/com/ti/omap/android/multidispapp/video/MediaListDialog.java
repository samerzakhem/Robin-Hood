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
package com.ti.omap.android.multidispapp.video;

import android.app.DialogFragment;
import android.content.CursorLoader;
import android.database.Cursor;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.SimpleCursorAdapter;
import android.widget.TextView;

import com.ti.omap.android.multidispapp.DDHelper;
import com.ti.omap.android.multidispapp.R;

public class MediaListDialog extends DialogFragment implements OnClickListener {

    public interface MediaFileSelectionListener {
        public void onFileSelected(int playerId, String name, long size,
                String mime);
    }

    private ListView mListView;
    private MediaFileSelectionListener mListener;
    private Cursor mCursor;
    private int mPlayerId;

    final public static MediaListDialog getInstance(int playerId,
            MediaFileSelectionListener listener) {
        MediaListDialog dialog = new MediaListDialog();
        dialog.mPlayerId = playerId;
        dialog.mListener = listener;
        return dialog;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {
        View view = inflater
                .inflate(R.layout.video_selection, container, false);

        DDHelper.registerClickListener(R.id.media_dialog_refresh, this, view);
        DDHelper.registerClickListener(R.id.media_dialog_cancel, this, view);

        mListView = (ListView) view.findViewById(R.id.media_dialog_list);
        mListView.setOnItemClickListener(mClickListener);

        mListView.setAdapter(makeListAdapter());

        return view;
    }

    private OnItemClickListener mClickListener = new OnItemClickListener() {
        @Override
        public void onItemClick(AdapterView<?> parent, View view, int position,
                long id) {
            TextView sizeView = (TextView) view
                    .findViewById(R.id.media_file_size);
            TextView mimeView = (TextView) view
                    .findViewById(R.id.media_file_mime);

            int video_column_index = mCursor
                    .getColumnIndexOrThrow(MediaStore.Video.Media.DATA);
            mCursor.moveToPosition(position);
            String filename = mCursor.getString(video_column_index);

            mListener.onFileSelected(mPlayerId, filename, Long
                    .parseLong(sizeView.getText().toString()), mimeView
                    .getText().toString());
            dismiss();
        }
    };

    private ListAdapter makeListAdapter() {
        if (mCursor == null) {
            mCursor = getMediaFilesCursor();
        }

        return new SimpleCursorAdapter(getActivity(), R.layout.media_file_info,
                mCursor, new String[] { MediaStore.Video.Media.DISPLAY_NAME,
                        MediaStore.Video.Media.SIZE,
                        MediaStore.Video.Media.MIME_TYPE }, new int[] {
                        R.id.media_file_name, R.id.media_file_size,
                        R.id.media_file_mime },
                SimpleCursorAdapter.NO_SELECTION);
    }

    private Cursor getMediaFilesCursor() {
        String[] proj = { MediaStore.Video.Media._ID,
                MediaStore.Video.Media.DATA,
                MediaStore.Video.Media.DISPLAY_NAME,
                MediaStore.Video.Media.SIZE, MediaStore.Video.Media.MIME_TYPE };
        CursorLoader loader = new CursorLoader(getActivity(),
                MediaStore.Video.Media.EXTERNAL_CONTENT_URI, proj, null, null,
                null);
        Cursor cursor = loader.loadInBackground();
        return cursor;
    }

    @Override
    public void onClick(View v) {
        int viewId = v.getId();
        switch (viewId) {
        case R.id.media_dialog_refresh:
            ((SimpleCursorAdapter) mListView.getAdapter())
                    .changeCursor(getMediaFilesCursor());
            ((SimpleCursorAdapter) mListView.getAdapter())
                    .notifyDataSetChanged();
            break;
        case R.id.media_dialog_cancel:
            dismiss();
            break;
        }
    }

    @Override
    public void onStop() {
        super.onStop();
        /*
         * TODO For some reason if we close the cursor here large videos can
         * cause StaleDataException - access closed cursor
         */

        // mCursor.close();
        // mCursor = null;
    }
}

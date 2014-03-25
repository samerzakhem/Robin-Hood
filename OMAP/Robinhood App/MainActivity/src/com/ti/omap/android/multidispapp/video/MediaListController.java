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

import android.app.Fragment;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.ti.omap.android.multidispapp.R;
import com.ti.omap.android.multidispapp.video.MediaListDialog.MediaFileSelectionListener;
import com.ti.omap.android.multidispapp.video.VideoStorage.VideoItem;
import com.ti.omap.android.multidispapp.DDHelper;

final public class MediaListController implements OnClickListener {

    private BaseAdapter mAdapter;
    final private ListView mListView;
    final private Context mContext;
    final private Fragment mFragment;
    final private VideoPlaybackServer mServer;

    public MediaListController(ListView listView, VideoPlaybackServer server,
            Fragment fragment) {
        mListView = listView;
        mServer = server;
        mFragment = fragment;
        mContext = listView.getContext();
    }

    private void updateList() {
        if (mListView != null) {
            mListView.invalidateViews();
        }
    }

    synchronized public BaseAdapter getAdapter() {
        if (mAdapter == null) {
            mAdapter = new MediaListAdapter(this);
        }
        return mAdapter;
    }

    final private static class MediaListAdapter extends BaseAdapter {
        final private MediaListController mController;
        final private LayoutInflater mInflater;

        public MediaListAdapter(MediaListController controller) {
            mController = controller;
            Context context = mController.mContext;
            mInflater = (LayoutInflater) context
                    .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View view = mInflater.inflate(R.layout.media_player_list_item,
                    parent, false);

            DDHelper.registerClickListener(R.id.media_player_item_edit,
                    mController, view);
            DDHelper.registerClickListener(R.id.media_player_item_play,
                    mController, view);
            DDHelper.registerClickListener(R.id.media_player_item_pause,
                    mController, view);
            DDHelper.registerClickListener(R.id.media_player_item_stop,
                    mController, view);

            TextView nameView = (TextView) view
                    .findViewById(R.id.media_file_name);
            TextView sizeView = (TextView) view
                    .findViewById(R.id.media_file_size);
            TextView mimeView = (TextView) view
                    .findViewById(R.id.media_file_mime);

            VideoStorage videoStorage = mController.mServer.getVideoStorage();
            VideoItem item = videoStorage.getVideoItem(position);
            nameView.setText(item.getFileName());
            sizeView.setText(Long.toString(item.getFileSize()));
            mimeView.setText(item.getFileMime());

            return view;
        }

        @Override
        public int getCount() {
            return mController.mServer.getVideoStorage().getStorageSize();
        }

        @Override
        public Object getItem(int position) {
            return position;
        }

        @Override
        public long getItemId(int position) {
            return position;
        }
    }

    @Override
    public void onClick(View v) {
        int viewId = v.getId();
        int playerId = mListView.getPositionForView((View) v.getParent());
        switch (viewId) {
        case R.id.media_player_item_edit: {
            MediaFileSelectionListener listener = new SelectionListener(this);
            MediaListDialog.getInstance(playerId, listener).show(
                    mFragment.getFragmentManager(), "mediaList");
        }
            break;
        case R.id.media_player_item_play: {
            VideoStorage storage = mServer.getVideoStorage();
            VideoItem item = storage.getVideoItem(playerId);
            String filePath = null;
            try {
                filePath = item.getFileName();
            } catch (IllegalStateException e) {
                Context context = v.getContext();
                Toast.makeText(context, R.string.unsupported_version,
                        Toast.LENGTH_SHORT).show();
                return;
            }
            int position = item.getPosition();
            mServer.play(playerId, filePath, position);
        }
            break;
        case R.id.media_player_item_pause:
            mServer.pause(playerId);
            break;
        case R.id.media_player_item_stop:
            mServer.stop(playerId);
            break;
        default:
            throw new IllegalArgumentException("Unhandled click on view: "
                    + Integer.toHexString(viewId) + " on postion: " + playerId);
        }
    }

    final private static class SelectionListener implements
            MediaFileSelectionListener {
        final private MediaListController mController;

        public SelectionListener(MediaListController controller) {
            mController = controller;
        }

        @Override
        public void onFileSelected(int playerId, String name, long size,
                String mime) {
            VideoStorage storage = mController.mServer.getVideoStorage();
            storage.reinitVideoItem(playerId, name, size, mime);
            mController.updateList();
        }
    }

}

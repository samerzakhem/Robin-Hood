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

import android.app.Activity;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import android.widget.VideoView;

import com.ti.omap.android.multidispapp.OnCommandListener;
import com.ti.omap.android.multidispapp.PrimaryFragment;
import com.ti.omap.android.multidispapp.R;
import com.ti.omap.android.multidispapp.video.VideoPlaybackServer.Client;
import com.ti.omap.android.multidispapp.video.VideoStorage.VideoCtrl;

public class PrimaryVideoFragment extends PrimaryFragment {

    final private int mViewIds[] = { R.id.video_surface_2,
            R.id.video_surface_0, R.id.video_surface_1 };

    private int mDisplayNum;
    private VideoPlaybackServer mPlaybackServer;
    private MediaListController mMediaListController;
    private VideoView[] mViews;

    private OnCommandListener mCommandCallback;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {
        mDisplayNum = getExtDisplayCount();
        int layoutId = (mDisplayNum == 0 ? R.layout.video_primary
                : R.layout.video_primary_singledisplay);
        View view = inflater.inflate(layoutId, container, false);
        View extView = inflater.inflate(R.layout.video_secondary, container,
                false);

        mViews = new VideoView[VideoPlaybackServer.PLAYERS_COUNT];
        int primaryPlayersCount = (mDisplayNum == 0 ? VideoPlaybackServer.PLAYERS_COUNT
                : 1);

        for (int i = 0; i < VideoPlaybackServer.PLAYERS_COUNT; i++) {
            int id = mViewIds[i];
            if (i >= primaryPlayersCount) {
                mViews[i] = (VideoView) extView.findViewById(id);
            } else {
                mViews[i] = (VideoView) view.findViewById(id);
            }
        }

        mPlaybackServer = VideoPlaybackServer.getInstance();
        ListView listView = (ListView) view.findViewById(R.id.media_list);
        mMediaListController = new MediaListController(listView,
                mPlaybackServer, this);
        listView.setAdapter(mMediaListController.getAdapter());

        return view;
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

        if (mDisplayNum != 0) {
            playersInit();
        }
    }

    @Override
    public void onStart() {
        super.onStart();

        if ((mDisplayNum == 0)) {
            for (int i = 0; i < VideoPlaybackServer.PLAYERS_COUNT; i++) {
                VideoView view = mViews[i];
                Client client = new LocalClient(i, view, mPlaybackServer);
                mPlaybackServer.registerClient(client, i);
            }

        } else {
            mPlaybackServer.registerClient(new RemoteClient(mCommandCallback,
                    0, getDisplayId(0)), 0);
            if (mDisplayNum > 1) {
                mPlaybackServer.registerClient(new RemoteClient(
                        mCommandCallback, 1, getDisplayId(1)), 1);
            } else {
                mPlaybackServer.registerClient(new RemoteClient(
                        mCommandCallback, 1, getDisplayId(0)), 1);
            }
            mPlaybackServer.registerClient(new LocalClient(2, mViews[0],
                    mPlaybackServer), 2);
        }
    }

    @Override
    public void onStop() {
        super.onStop();
        for (int i = 0; i < VideoPlaybackServer.PLAYERS_COUNT; i++) {
            mPlaybackServer.unregisterClient(i);
        }
    }

    private void playersInit() {
        Bundle cmd = new Bundle();
        cmd.putInt(VideoCmdDefines.CMD, VideoCmdDefines.CMD_INIT);
        cmd.putInt(VideoCmdDefines.PLAYERS_COUNT,
                VideoPlaybackServer.PLAYERS_COUNT - 1);
        mCommandCallback.onCommand(cmd);
    }

    private static class LocalClient implements VideoPlaybackServer.Client {
        private VideoCtrl mPlaybackCtrl;

        public LocalClient(int playerId, VideoView videoView,
                VideoPlaybackServer playbackServer) {
            VideoStorage videoStorage = playbackServer.getVideoStorage();
            mPlaybackCtrl = videoStorage.getVideoCtrl(playerId, videoView);
        }

        @Override
        public void play(String videoPath, int position) {
            mPlaybackCtrl.makePlayVideo(videoPath, position);
        }

        @Override
        public void pause() {
            mPlaybackCtrl.makePause();
        }

        @Override
        public void stop() {
            mPlaybackCtrl.makeStop();
        }

        @Override
        public void close() {
            mPlaybackCtrl.updatePosition();
            mPlaybackCtrl = null;
        }
    }

    private class RemoteClient implements VideoPlaybackServer.Client {
        final private int mPlayerId;
        final private OnCommandListener mCommandCallback;
        final private int mDisplayId;

        public RemoteClient(OnCommandListener commandCallback, int playerId,
                int mDisplayId) {
            this.mCommandCallback = commandCallback;
            this.mPlayerId = playerId;
            this.mDisplayId = mDisplayId;
        }

        @Override
        public void play(String videoPath, int position) {
            Bundle cmd = new Bundle();
            cmd.putInt(VideoCmdDefines.CMD, VideoCmdDefines.CMD_PLAY_VIDEO);
            cmd.putInt(VideoCmdDefines.PLAYER_ID, mPlayerId);
            cmd.putString(VideoCmdDefines.VIDEO_FILE_NAME, videoPath);
            cmd.putInt(VideoCmdDefines.VIDEO_FILE_POSITION, position);
            cmd.putInt(OnCommandListener.DISPLAY_ID, mDisplayId);
            mCommandCallback.onCommand(cmd);
        }

        @Override
        public void pause() {
            Bundle cmd = new Bundle();
            cmd.putInt(VideoCmdDefines.CMD, VideoCmdDefines.CMD_PAUSE_VIDEO);
            cmd.putInt(VideoCmdDefines.PLAYER_ID, mPlayerId);
            cmd.putInt(OnCommandListener.DISPLAY_ID, mDisplayId);
            mCommandCallback.onCommand(cmd);
        }

        @Override
        public void stop() {
            Bundle cmd = new Bundle();
            cmd.putInt(VideoCmdDefines.CMD, VideoCmdDefines.CMD_STOP_VIDEO);
            cmd.putInt(VideoCmdDefines.PLAYER_ID, mPlayerId);
            cmd.putInt(OnCommandListener.DISPLAY_ID, mDisplayId);
            mCommandCallback.onCommand(cmd);
        }

        @Override
        public void close() {
            Bundle cmd = new Bundle();
            cmd.putInt(VideoCmdDefines.CMD, VideoCmdDefines.CMD_STORE_POSITION);
            cmd.putInt(VideoCmdDefines.PLAYER_ID, mPlayerId);
            cmd.putInt(OnCommandListener.DISPLAY_ID, mDisplayId);
            mCommandCallback.onCommand(cmd);
        }
    }

}

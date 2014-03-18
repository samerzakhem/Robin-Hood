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

import android.content.Context;
import android.os.Bundle;
import android.util.SparseArray;
import android.view.Display;
import android.widget.VideoView;

import com.ti.omap.android.multidispapp.DDPresentation;
import com.ti.omap.android.multidispapp.PresentationContents;
import com.ti.omap.android.multidispapp.R;
import com.ti.omap.android.multidispapp.video.VideoStorage.VideoCtrl;

final public class VideoPresentation extends DDPresentation {

    final public static int SURFACE_COUNT = VideoPlaybackServer.PLAYERS_COUNT - 1;

    final private static int[] mSurfaceIds = { R.id.video_surface_0,
            R.id.video_surface_1 };
    private SparseArray<VideoCtrl> mVideoCtrls;

    public VideoPresentation(Context outerContext, Display display,
            PresentationContents pContents) {
        super(outerContext, display, pContents);
        setContentView(R.layout.video_secondary);

        VideoPlaybackServer server = VideoPlaybackServer.getInstance();
        VideoStorage storage = server.getVideoStorage();
        mVideoCtrls = new SparseArray<VideoCtrl>(SURFACE_COUNT);
        for (int i = 0; i < SURFACE_COUNT; i++) {
            VideoView videoView = (VideoView) findViewById(mSurfaceIds[i]);
            mVideoCtrls.append(i, storage.getVideoCtrl(i, videoView));
        }
    }

    public void init(int playersCount) {
        if (playersCount != SURFACE_COUNT) {
            throw new IllegalArgumentException("Players count doesn't match "
                    + "surfaces count: players: " + playersCount
                    + ", surfaces: " + SURFACE_COUNT);
        }
    }

    public void playVideo(int playerId, String fileName, int position) {
        VideoCtrl videoCtrl = mVideoCtrls.get(playerId);
        if (videoCtrl != null) {
            videoCtrl.makePlayVideo(fileName, position);
        }
    }

    public void pauseVideo(int playerId) {
        VideoCtrl videoCtrl = mVideoCtrls.get(playerId);
        if (videoCtrl != null) {
            videoCtrl.makePause();
        }
    }

    public void stopVideo(int playerId) {
        VideoCtrl videoCtrl = mVideoCtrls.get(playerId);
        if (videoCtrl != null) {
            videoCtrl.makeStop();
        }
    }

    public void storePosition(int playerId) {
        if (mVideoCtrls != null) {
            VideoCtrl videoCtrl = mVideoCtrls.get(playerId);
            if (videoCtrl != null) {
                videoCtrl.updatePosition();
            }
        }
    }

    @Override
    public void onCommand(Bundle cmd) {
        int command = cmd.getInt(VideoCmdDefines.CMD,
                VideoCmdDefines.CMD_UNDEFINED);
        int playerId = cmd.getInt(VideoCmdDefines.PLAYER_ID, -1);
        switch (command) {
        case VideoCmdDefines.CMD_INIT: {
            int playersCount = cmd.getInt(VideoCmdDefines.PLAYERS_COUNT, -1);
            init(playersCount);
        }
            break;
        case VideoCmdDefines.CMD_PLAY_VIDEO: {
            String fileName = cmd
                    .getString(VideoCmdDefines.VIDEO_FILE_NAME, "");
            int position = cmd.getInt(VideoCmdDefines.VIDEO_FILE_POSITION, 0);
            playVideo(playerId, fileName, position);
        }
            break;
        case VideoCmdDefines.CMD_PAUSE_VIDEO:
            pauseVideo(playerId);
            break;
        case VideoCmdDefines.CMD_STOP_VIDEO:
            stopVideo(playerId);
            break;
        case VideoCmdDefines.CMD_STORE_POSITION:
            storePosition(playerId);
            break;
        default:
        }
    }
}

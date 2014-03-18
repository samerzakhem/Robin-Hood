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
import android.view.Display;
import android.widget.VideoView;

import com.ti.omap.android.multidispapp.DDPresentation;
import com.ti.omap.android.multidispapp.PresentationContents;
import com.ti.omap.android.multidispapp.R;
import com.ti.omap.android.multidispapp.video.VideoStorage.VideoCtrl;

final public class SingleVideoPresentation extends DDPresentation {

    private VideoCtrl mVideoCtrl;

    // @Override
    public SingleVideoPresentation(Context outerContext, Display display,
            PresentationContents pContents) {
        super(outerContext, display, pContents);
        setContentView(R.layout.video_secondary_single);
    }

    public void setPlayer(int playerId) {
        VideoPlaybackServer server = VideoPlaybackServer.getInstance();
        VideoStorage storage = server.getVideoStorage();
        mVideoCtrl = storage.getVideoCtrl(playerId,
                (VideoView) findViewById(R.id.video_surface_single));
    }

    public void playVideo(int playerId, String fileName, int position) {
        if (mVideoCtrl != null) {
            mVideoCtrl.makePlayVideo(fileName, position);
        }
    }

    public void pauseVideo(int playerId) {
        if (mVideoCtrl != null) {
            mVideoCtrl.makePause();
        }
    }

    public void stopVideo(int playerId) {
        if (mVideoCtrl != null) {
            mVideoCtrl.makeStop();
        }
    }

    public void storePosition(int playerId) {
        if (mVideoCtrl != null) {
            mVideoCtrl.updatePosition();
        }
    }

    @Override
    public void onCommand(Bundle cmd) {
        // Log.d(getClass().getSimpleName(), "cmd: [" +
        // VideoCmdDefines.printCmd(cmd) + "]");
        int command = cmd.getInt(VideoCmdDefines.CMD,
                VideoCmdDefines.CMD_UNDEFINED);
        int playerId = cmd.getInt(VideoCmdDefines.PLAYER_ID, -1);
        switch (command) {
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
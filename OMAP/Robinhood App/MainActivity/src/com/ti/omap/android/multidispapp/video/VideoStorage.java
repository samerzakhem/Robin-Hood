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
import android.media.MediaPlayer;
import android.media.MediaPlayer.OnCompletionListener;
import android.util.Log;
import android.util.SparseArray;
import android.widget.Toast;
import android.widget.VideoView;

import com.ti.omap.android.multidispapp.R;

public class VideoStorage {
    private SparseArray<VideoCtrl> mVideoCtrls;
    private SparseArray<VideoItem> mVideoItems;

    VideoStorage(int playersCount) {
        mVideoItems = new SparseArray<VideoItem>(playersCount);
        for (int i = 0; i < playersCount; i++) {
            mVideoItems.append(i, new VideoItem());
        }
        mVideoCtrls = new SparseArray<VideoCtrl>(playersCount);
    }

    public VideoCtrl getVideoCtrl(int playerId, VideoView videoView) {
        VideoCtrl videoCtrl = null;
        synchronized (mVideoCtrls) {
            videoCtrl = mVideoCtrls.get(playerId);
            if (videoCtrl == null) {
                videoCtrl = new VideoCtrl(playerId, videoView, this);
                mVideoCtrls.put(playerId, videoCtrl);
            } else {
                VideoView currentVideoView = videoCtrl.mVideoView;
                if (currentVideoView != videoView) {
                    String path = videoCtrl.mPath;
                    VideoItem item = getVideoItem(playerId);
                    int position = item.position;
                    int oldState = videoCtrl.mState;
                    Log.d(getClass().getSimpleName(), "DBG: id: " + playerId
                            + ", pos: " + position + ", state: " + oldState
                            + ", path: " + path);
                    videoCtrl = new VideoCtrl(playerId, videoView, this);
                    mVideoCtrls.put(playerId, videoCtrl);
                    if (oldState == VideoCtrl.STATE_PAUSED) {
                        videoCtrl.mVideoView.seekTo(position);
                    } else if (oldState == VideoCtrl.STATE_STARTED) {
                        videoCtrl.makePlayVideo(path, position);
                    }
                }
            }
        }
        synchronized (videoCtrl) {
            if (videoCtrl.mState < VideoCtrl.STATE_INITED) {
                videoCtrl.init();
            }
        }

        return videoCtrl;
    }

    public void reinitVideoItem(int playerId, String name, long size,
            String mime) {
        VideoItem item = new VideoItem();
        item.fileName = name;
        item.fileSize = size;
        item.fileMime = mime;
        item.position = 0;
        synchronized (mVideoItems) {
            mVideoItems.put(playerId, item);
        }
    }

    public void updateVideoPosition(int playerId, int position) {
        VideoItem item = getVideoItem(playerId);
        item.position = position;
    }

    public VideoItem getVideoItem(int playerId) {
        VideoItem item = null;
        synchronized (mVideoItems) {
            item = mVideoItems.get(playerId);
            if (item == null) {
                item = new VideoItem();
                mVideoItems.put(playerId, item);
            }
        }
        return item;
    }

    public int getStorageSize() {
        synchronized (mVideoItems) {
            return mVideoItems.size();
        }
    }

    final public static class VideoItem implements Cloneable {
        private String fileName;
        private long fileSize;
        private String fileMime;
        private int position;

        private VideoItem() {
        }

        public String getFileName() {
            return fileName;
        }

        public String getFileMime() {
            return fileMime;
        }

        public long getFileSize() {
            return fileSize;
        }

        public int getPosition() {
            return position;
        }

        public boolean isValid() {
            return fileName != null && fileName.length() > 0 && fileSize > 0
                    && fileMime != null && fileMime.length() > 0;
        }
    }

    public static class VideoCtrl implements OnCompletionListener {
        final private static int STATE_UNDEFINED = -1;
        final private static int STATE_INITED = 0;
        final private static int STATE_STARTED = 1;
        final private static int STATE_PAUSED = 2;
        final private static int STATE_STOPED = 3;

        final private VideoView mVideoView;
        private String mPath;
        final private int mPlayerId;
        final private VideoStorage mStorage;
        private int mState;

        private VideoCtrl(int playerId, VideoView videoView,
                VideoStorage videoStorage) {
            mVideoView = videoView;
            mVideoView.setOnCompletionListener(this);
            mVideoView.setOnErrorListener(new MediaPlayer.OnErrorListener() {

                public boolean onError(MediaPlayer mp, int what, int extra) {
                    Log.e(getClass().getSimpleName(),
                            "Can't play the video now.");
                    Context context = mVideoView.getContext();
                    Toast.makeText(context, R.string.cant_play_video,
                            Toast.LENGTH_SHORT).show();
                    makeStop();

                    return true;
                }
            });
            mPlayerId = playerId;
            mStorage = videoStorage;
            mState = STATE_UNDEFINED;
        }

        private void init() {
            mState = STATE_INITED;
        }

        public void makePlayVideo(String fileName, int position) {
            if (fileName == null || fileName.length() <= 0 || position < 0) {
                return;
            }
            if (mPath != null && mPath.equals(fileName)) {
                if (mVideoView.isPlaying()) {
                    // ignore re-playback of the same file
                } else {
                    // was paused -> resume
                    mVideoView.start();
                }
                return;
            }
            mPath = fileName;
            mVideoView.setVideoPath(fileName);
            if (position > 0) {
                mVideoView.seekTo(position);
            }
            mVideoView.start();
            mState = STATE_STARTED;
        }

        public void makePause() {
            if (mVideoView.canPause()) {
                mVideoView.pause();
                mState = STATE_PAUSED;
            } else {
                Context context = mVideoView.getContext();
                Toast.makeText(context, R.string.cant_pause_video,
                        Toast.LENGTH_SHORT).show();
            }
        }

        public void makeStop() {
            mPath = null;
            mVideoView.stopPlayback();
            mStorage.updateVideoPosition(mPlayerId, 0);
            mState = STATE_STOPED;
        }

        public int getPosition() {
            return mVideoView.getCurrentPosition();
        }

        public void updatePosition() {
            int position = getPosition();
            Log.d(getClass().getSimpleName(), "DBG: updatePosition(): pos: "
                    + position);
            mStorage.updateVideoPosition(mPlayerId, position);
        }

        @Override
        public void onCompletion(MediaPlayer mp) {
            mStorage.updateVideoPosition(mPlayerId, 0);
            mState = STATE_STOPED;
        }
    }

}

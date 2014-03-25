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

import java.util.ArrayList;

import android.os.Handler;
import android.os.Message;
import android.util.Log;

final public class VideoPlaybackServer {

    final private static String TAG = "VideoPlaybackServer";
    final private static boolean DEBUG = false;

    final public static int PLAYERS_COUNT = 3;

    final private static int MSG_PLAY = 0;
    final private static int MSG_PAUSE = 1;
    final private static int MSG_STOP = 2;
    final private static int MSG_CLOSE = 3;

    public interface Client {
        public void play(String videoPath, int position);

        public void pause();

        public void stop();

        public void close();
    }

    private static VideoPlaybackServer sServer;

    synchronized final public static VideoPlaybackServer getInstance() {
        if (sServer == null) {
            sServer = new VideoPlaybackServer();
        }
        return sServer;
    }

    synchronized final public static void destroy() {
        if (sServer != null) {
            if (sServer.mPlaybackHandler != null) {
                sServer.mPlaybackHandler.removeMessages(MSG_PLAY);
                sServer.mPlaybackHandler.removeMessages(MSG_PAUSE);
                sServer.mPlaybackHandler.removeMessages(MSG_STOP);
                sServer.mPlaybackHandler.sendToAll(MSG_CLOSE);
                sServer.mPlaybackHandler = null;
            }
            sServer = null;
        }
    }

    private PlaybackHandler mPlaybackHandler;
    private ArrayList<Client> mClients;
    private VideoStorage mStorage;

    private VideoPlaybackServer() {
        mPlaybackHandler = new PlaybackHandler(this);
        mClients = new ArrayList<Client>(PLAYERS_COUNT);
        for (int i = 0; i < PLAYERS_COUNT; i++) {
            mClients.add(i, null);
        }
        mStorage = new VideoStorage(PLAYERS_COUNT);
    }

    public VideoStorage getVideoStorage() {
        return mStorage;
    }

    public boolean registerClient(Client client, int clientId) {
        if (clientId < 0 || clientId >= PLAYERS_COUNT) {
            throw new IllegalArgumentException(
                    "clientId should be in range [0, " + (PLAYERS_COUNT - 1)
                            + "]");
        }
        if (DEBUG)
            Log.d(TAG, "registerClient(): size: " + mClients.size() + ", id: "
                    + clientId + ", client: " + client);
        mClients.set(clientId, client);
        return true;
    }

    public boolean unregisterClient(int clientId) {
        Client client = mClients.get(clientId);
        if (client != null) {
            client.close();
        }

        mClients.set(clientId, null);
        if (DEBUG)
            Log.d(TAG, "unregisterClient(): size: " + mClients.size()
                    + ", id: " + clientId);
        return true;
    }

    public void play(int playerId, String filePath, int position) {
        mPlaybackHandler.sendPlayCmd(playerId, position, filePath);
    }

    public void pause(int playerId) {
        mPlaybackHandler.sendCmd(MSG_PAUSE, playerId);
    }

    public void stop(int playerId) {
        mPlaybackHandler.sendCmd(MSG_STOP, playerId);
    }

    private Client getClient(int clientId) {
        Client client;
        try {
            client = mClients.get(clientId);
        } catch (IndexOutOfBoundsException e) {
            client = null;
        }
        return client;
    }

    private static class PlaybackHandler extends Handler {
        private VideoPlaybackServer mServer;

        public PlaybackHandler(VideoPlaybackServer server) {
            mServer = server;
        }

        public void sendCmd(int cmd, int clientId) {
            Message message = obtainMessage(cmd);
            message.arg1 = clientId;
            sendMessage(message);
        }

        public void sendPlayCmd(int clientId, int position, String path) {
            Message message = obtainMessage(MSG_PLAY);
            message.arg1 = clientId;
            message.arg2 = position;
            message.obj = path;
            sendMessage(message);
        }

        public void sendToAll(int cmd) {
            for (int i = 0; i < PLAYERS_COUNT; i++) {
                Client client = mServer.getClient(i);
                if (client != null) {
                    sendCmd(cmd, i);
                }
            }
        }

        @Override
        public void dispatchMessage(Message msg) {
            int clientId = msg.arg1;
            Client client = mServer.getClient(clientId);
            if (client == null) {
                if (DEBUG)
                    Log.w(TAG, "dispatchMessage(): client is null for id: "
                            + clientId);
                return;
            }
            switch (msg.what) {
            case MSG_PLAY: {
                String filePath = (String) msg.obj;
                int position = msg.arg2;
                client.play(filePath, position);
            }
                break;
            case MSG_PAUSE:
                client.pause();
                break;
            case MSG_STOP:
                client.stop();
                break;
            case MSG_CLOSE:
                client.close();
                break;
            }
        }
    }

}

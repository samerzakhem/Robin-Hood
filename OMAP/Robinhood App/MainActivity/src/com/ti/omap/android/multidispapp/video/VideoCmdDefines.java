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

import android.os.Bundle;

final public class VideoCmdDefines {

    final public static String CMD = "cmd";

    final public static int CMD_UNDEFINED = -1;
    final public static int CMD_INIT = 0;
    final public static int CMD_PLAY_VIDEO = 1;
    final public static int CMD_PAUSE_VIDEO = 2;
    final public static int CMD_STOP_VIDEO = 3;
    final public static int CMD_STORE_POSITION = 4;

    final public static String PLAYERS_COUNT = "playersCount";
    final public static String PLAYER_ID = "playerId";

    final public static String VIDEO_FILE_NAME = "videoName";
    final public static String VIDEO_FILE_POSITION = "videoPos";

    public static String printCmd(Bundle cmd) {
        if (cmd == null || cmd.size() == 0) {
            return "<Illegal or empty>";
        }
        StringBuilder sb = new StringBuilder();
        sb.append("command: ");
        sb.append(cmdToString(cmd.getInt(VideoCmdDefines.CMD,
                VideoCmdDefines.CMD_UNDEFINED)));

        if (cmd.containsKey(VideoCmdDefines.PLAYER_ID)) {
            sb.append(", playerId: ");
            sb.append(cmd.getInt(VideoCmdDefines.PLAYER_ID));
        }

        if (cmd.containsKey(VideoCmdDefines.PLAYERS_COUNT)) {
            sb.append(", count: ");
            sb.append(cmd.getInt(VideoCmdDefines.PLAYERS_COUNT));
        }

        if (cmd.containsKey(VideoCmdDefines.VIDEO_FILE_NAME)) {
            sb.append(", file: ");
            sb.append(cmd.getString(VideoCmdDefines.VIDEO_FILE_NAME));
        }

        return sb.toString();
    }

    public static String cmdToString(int cmdId) {
        switch (cmdId) {
        case VideoCmdDefines.CMD_UNDEFINED:
            return "UNDEFINED";
        case VideoCmdDefines.CMD_INIT:
            return "INIT";
        case VideoCmdDefines.CMD_PLAY_VIDEO:
            return "PLAY_VIDEO";
        case VideoCmdDefines.CMD_PAUSE_VIDEO:
            return "PAUSE_VIDEO";
        case VideoCmdDefines.CMD_STOP_VIDEO:
            return "STOP_VIDEO";
        }

        return "";
    }
}
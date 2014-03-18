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
package com.ti.omap.android.multidispapp.graphics;

import android.view.View;
import android.view.View.OnClickListener;

import com.ti.omap.android.multidispapp.R;

public class ButtonsCtrl implements OnClickListener {

    public interface CmdSender {
        public void sendCommand(int cmd);
    }

    final public static String FIELD_CMD = "cmd";

    final private static int CMD_UNDEFINED = -1; // for internal use only
    final public static int CMD_CENTER = 0;
    final public static int CMD_UP = 1;
    final public static int CMD_DOWN = 2;
    final public static int CMD_LEFT = 3;
    final public static int CMD_RIGHT = 4;

    // for internal use only
    final private static int FIRST_MOVE_CMD = CMD_CENTER;
    final private static int LAST_MOVE_CMD = CMD_RIGHT;

    private CmdSender mSender;

    public ButtonsCtrl(CmdSender sender) {
        mSender = sender;
    }

    @Override
    public void onClick(View v) {
        int viewId = v.getId();
        int cmd = CMD_UNDEFINED;
        switch (viewId) {
        case R.id.scroller_center:
            cmd = CMD_CENTER;
            break;
        case R.id.scroller_up:
            cmd = CMD_UP;
            break;
        case R.id.scroller_down:
            cmd = CMD_DOWN;
            break;
        case R.id.scroller_left:
            cmd = CMD_LEFT;
            break;
        case R.id.scroller_right:
            cmd = CMD_RIGHT;
            break;
        }

        if (cmd != CMD_UNDEFINED) {
            mSender.sendCommand(cmd);
        }
    }

    final public static String cmdToString(int cmd) {
        switch (cmd) {
        case CMD_CENTER:
            return "Center";
        case CMD_UP:
            return "Up";
        case CMD_DOWN:
            return "Down";
        case CMD_LEFT:
            return "Left";
        case CMD_RIGHT:
            return "Right";
        }
        throw new IllegalArgumentException(
                "cmdToString(): Not handled command code: " + cmd);
    }

    public static boolean isCmdMove(int cmd) {
        return cmd >= FIRST_MOVE_CMD && cmd <= LAST_MOVE_CMD;
    }

}

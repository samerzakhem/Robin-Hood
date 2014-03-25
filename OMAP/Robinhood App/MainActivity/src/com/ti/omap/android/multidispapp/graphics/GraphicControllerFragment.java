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

import android.app.Activity;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;

import com.ti.omap.android.multidispapp.DDHelper;
import com.ti.omap.android.multidispapp.OnCommandListener;
import com.ti.omap.android.multidispapp.PrimaryFragment;
import com.ti.omap.android.multidispapp.R;
import com.ti.omap.android.multidispapp.graphics.ButtonsCtrl.CmdSender;

public class GraphicControllerFragment extends PrimaryFragment implements
        CmdSender {

    final public static String FIELD_CMD = "cmd";

    final private static int CMD_UNDEFINED = -1; // for internal use only

    final public static int CMD_RED = 100;
    final public static int CMD_GREEN = 101;
    final public static int CMD_YELLOW = 102;
    final public static int CMD_BLUE = 103;

    // for internal use only
    final private static int FIRST_COLOR_CMD = CMD_RED;
    final private static int LAST_COLOR_CMD = CMD_BLUE;

    private ButtonsCtrl mButtonsCtrl;
    private OnCommandListener mCommandCallback;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.graphic_controls, container,
                false);

        mButtonsCtrl = new ButtonsCtrl(this);

        DDHelper.registerClickListener(R.id.scroller_center, mButtonsCtrl, view);
        DDHelper.registerClickListener(R.id.scroller_up, mButtonsCtrl, view);
        DDHelper.registerClickListener(R.id.scroller_down, mButtonsCtrl, view);
        DDHelper.registerClickListener(R.id.scroller_left, mButtonsCtrl, view);
        DDHelper.registerClickListener(R.id.scroller_right, mButtonsCtrl, view);

        DDHelper.registerClickListener(R.id.color_red, mColorsListener, view);
        DDHelper.registerClickListener(R.id.color_green, mColorsListener, view);
        DDHelper.registerClickListener(R.id.color_yellow, mColorsListener, view);
        DDHelper.registerClickListener(R.id.color_blue, mColorsListener, view);

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
    }

    private OnClickListener mColorsListener = new OnClickListener() {

        @Override
        public void onClick(View v) {
            int viewId = v.getId();
            int cmd = CMD_UNDEFINED;
            switch (viewId) {
            case R.id.color_red:
                cmd = CMD_RED;
                break;
            case R.id.color_green:
                cmd = CMD_GREEN;
                break;
            case R.id.color_yellow:
                cmd = CMD_YELLOW;
                break;
            case R.id.color_blue:
                cmd = CMD_BLUE;
                break;
            }

            if (cmd != CMD_UNDEFINED) {
                sendCommand(cmd);
            }
        }

    };

    @Override
    public void sendCommand(int cmd) {
        Bundle cmdData = new Bundle();
        cmdData.putInt(FIELD_CMD, cmd);
        cmdData.putInt(OnCommandListener.DISPLAY_ID, getDisplayId(0));

        mCommandCallback.onCommand(cmdData);
    }

    final public static String cmdToString(int cmd) {
        switch (cmd) {
        case CMD_RED:
            return "Red";
        case CMD_GREEN:
            return "Green";
        case CMD_YELLOW:
            return "Yellow";
        case CMD_BLUE:
            return "Blue";
        default:
            return ButtonsCtrl.cmdToString(cmd);
        }
    }

    public static boolean isCmdMove(int cmd) {
        return ButtonsCtrl.isCmdMove(cmd);
    }

    public static boolean isCmdColor(int cmd) {
        return cmd >= FIRST_COLOR_CMD && cmd <= LAST_COLOR_CMD;
    }

}

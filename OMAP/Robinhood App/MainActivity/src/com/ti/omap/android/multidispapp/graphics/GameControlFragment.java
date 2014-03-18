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
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.View.OnTouchListener;
import android.view.ViewGroup;
import android.widget.SeekBar;
import android.widget.SeekBar.OnSeekBarChangeListener;
import android.widget.TextView;

import com.ti.omap.android.multidispapp.OnCommandListener;
import com.ti.omap.android.multidispapp.PrimaryFragment;
import com.ti.omap.android.multidispapp.R;
import com.ti.omap.android.multidispapp.graphics.ButtonsCtrl.CmdSender;
import com.ti.omap.android.multidispapp.DDHelper;

public class GameControlFragment extends PrimaryFragment implements CmdSender {

    final public static String FIELD_CMD = "cmd";

    final public static int CMD_SET_ROTATION = 100;
    final public static int CMD_ROTATE = 101;

    final public static String FIELD_PHI = "phi";
    final public static String FIELD_THETA = "theta";
    final public static String FIELD_DELTA_PHI = "dPhi";
    final public static String FIELD_DELTA_THETA = "dTheta";

    final private static int SENS_MAX = 256;
    final private static double SENS_OCTAVES = 4.0;
    final private static double SENS_SCALE = SENS_MAX / SENS_OCTAVES;

    private OnCommandListener mCommandCallback;

    private float mSensitivity = 1.0f;
    private View mFirstTouchView;
    ButtonsCtrl mButtonsCtrl;

    public GameControlFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.game_controls, container, false);

        mButtonsCtrl = new ButtonsCtrl(this);
        DDHelper.registerClickListener(R.id.scroller_center, mButtonsCtrl, view);
        DDHelper.registerClickListener(R.id.scroller_up, mButtonsCtrl, view);
        DDHelper.registerClickListener(R.id.scroller_down, mButtonsCtrl, view);
        DDHelper.registerClickListener(R.id.scroller_left, mButtonsCtrl, view);
        DDHelper.registerClickListener(R.id.scroller_right, mButtonsCtrl, view);

        mFirstTouchView = view.findViewById(R.id.game_control_touch1);
        mFirstTouchView.setOnTouchListener(mFirstToucher);

        initSensitivityBar(view);

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

    private void initSensitivityBar(View view) {
        final SeekBar sensBar = (SeekBar) view
                .findViewById(R.id.game_control_sensitivity_seekbar);
        final TextView sensText = (TextView) view
                .findViewById(R.id.game_control_sensitivity_text);
        sensBar.setOnSeekBarChangeListener(new OnSeekBarChangeListener() {
            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {
            }

            @Override
            public void onProgressChanged(SeekBar seekBar, int progress,
                    boolean fromUser) {
                if (progress < 0)
                    progress = 0;
                if (progress > SENS_MAX)
                    progress = SENS_MAX;
                double scalePos = (double) progress / SENS_SCALE - SENS_OCTAVES
                        / 2;
                double logProgress = Math.pow(2, scalePos);
                mSensitivity = (float) logProgress;
                String logString = String.format("%1.2f", logProgress);
                sensText.setText(getString(R.string.sensitivity, logString));
            }
        });
        sensBar.setProgress(SENS_MAX / 2);
        View sensClear = view.findViewById(R.id.game_control_sensitivity_clear);
        sensClear.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                sensBar.setProgress(SENS_MAX / 2);
            }
        });
    }

    final private OnTouchListener mFirstToucher = new OnTouchListener() {
        final private static int TOUCH_MAX = 256;
        final private static float MOVE_THRESHOLD = 10.0f;
        final private static double PHI_RANGE = Math.PI / 2.0;
        final private static double THETA_RANGE = Math.PI / 2.0;
        private float lastX;
        private float lastY;

        @Override
        public boolean onTouch(View v, MotionEvent event) {
            int action = event.getAction();
            float x = event.getX();
            float y = event.getY();
            switch (action) {
            case MotionEvent.ACTION_DOWN:
                lastX = x;
                lastY = y;
                break;
            case MotionEvent.ACTION_UP: {
                float dx = x - lastX;
                float dy = y - lastY;
                double phiShift = PHI_RANGE * mSensitivity * dx / TOUCH_MAX;
                double thetaShift = THETA_RANGE * mSensitivity * dy / TOUCH_MAX;
                sendRotateCommand(phiShift, thetaShift);
            }
                break;
            case MotionEvent.ACTION_MOVE: {
                if (x < 0 || x > TOUCH_MAX || y < 0 || y > TOUCH_MAX) {
                    // ignore touches outside the view
                    return false;
                }
                float dx = x - lastX;
                float dy = y - lastY;
                if (Math.abs(dx) + Math.abs(dy) < MOVE_THRESHOLD) {
                    // ignore small moves, also filters jitter
                    return true;
                }
                double phiShift = PHI_RANGE * mSensitivity * dx / TOUCH_MAX;
                double thetaShift = THETA_RANGE * mSensitivity * dy / TOUCH_MAX;
                sendRotateCommand(phiShift, thetaShift);
                lastX = x;
                lastY = y;
            }
                break;
            default:
                return false;
            }

            return true;
        }
    };

    @Override
    public void sendCommand(int cmd) {
        Bundle cmdData = new Bundle();
        cmdData.putInt(FIELD_CMD, cmd);
        cmdData.putInt(OnCommandListener.DISPLAY_ID, getDisplayId(0));

        mCommandCallback.onCommand(cmdData);
    }

    private void sendRotateCommand(double phiShift, double thetaShift) {
        Bundle cmd = new Bundle();
        cmd.putInt(FIELD_CMD, CMD_ROTATE);
        cmd.putDouble(FIELD_DELTA_PHI, phiShift);
        cmd.putDouble(FIELD_DELTA_THETA, thetaShift);
        cmd.putInt(OnCommandListener.DISPLAY_ID, getDisplayId(0));

        mCommandCallback.onCommand(cmd);
    }

}

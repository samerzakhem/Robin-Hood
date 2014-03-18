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

import android.content.Context;
import android.opengl.GLSurfaceView;
import android.os.Bundle;
import android.view.Display;
import android.view.View;
import android.widget.TextView;

import com.ti.omap.android.multidispapp.DDPresentation;
import com.ti.omap.android.multidispapp.PresentationContents;
import com.ti.omap.android.multidispapp.R;

public class GamePresentation extends DDPresentation {

    private GLSurfaceView mSurfaceView;
    private GameDrawer mGameDrawer;

    public GamePresentation(Context outerContext, Display display,
            PresentationContents pContents) {
        super(outerContext, display, pContents);
        setContentView(R.layout.graphics_gl);

        TextView cmdTextView = (TextView) findViewById(R.id.cmd_log);
        cmdTextView.setVisibility(View.GONE);
        mSurfaceView = (GLSurfaceView) findViewById(R.id.surface_graphics_gl);
        mGameDrawer = new GameDrawer(outerContext);
        mSurfaceView.setRenderer(mGameDrawer);
    }

    @Override
    protected void onStart() {
        super.onStart();
        mSurfaceView.onResume();
    }

    @Override
    protected void onStop() {
        super.onStop();
        mSurfaceView.onPause();
    }

    @Override
    public void onCommand(Bundle cmd) {
        final int commandCode = cmd.getInt(GameControlFragment.FIELD_CMD);
        switch (commandCode) {
        case ButtonsCtrl.CMD_UP:
            mGameDrawer.addTurn(Sections.TURN_UP);
            break;
        case ButtonsCtrl.CMD_DOWN:
            mGameDrawer.addTurn(Sections.TURN_DOWN);
            break;
        case ButtonsCtrl.CMD_LEFT:
            mGameDrawer.addTurn(Sections.TURN_LEFT);
            break;
        case ButtonsCtrl.CMD_RIGHT:
            mGameDrawer.addTurn(Sections.TURN_RIGHT);
            break;
        case ButtonsCtrl.CMD_CENTER:
            mGameDrawer.addTurn(Sections.NO_TURN);
            break;
        case GameControlFragment.CMD_SET_ROTATION: {
            double phi = cmd.getDouble(GameControlFragment.FIELD_PHI, 0.0);
            double theta = cmd.getDouble(GameControlFragment.FIELD_THETA, 0.0);
            mGameDrawer.setRotation(phi, theta);
        }
            break;
        case GameControlFragment.CMD_ROTATE: {
            double dPhi = cmd.getDouble(GameControlFragment.FIELD_DELTA_PHI,
                    0.0);
            double dTheta = cmd.getDouble(
                    GameControlFragment.FIELD_DELTA_THETA, 0.0);
            mGameDrawer.rotate(dPhi, dTheta);
        }
            break;
        }
    }
}
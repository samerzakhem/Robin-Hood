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
import android.graphics.Canvas;
import android.os.Bundle;
import android.view.SurfaceHolder;
import android.view.SurfaceHolder.Callback;
import android.view.Display;
import android.view.SurfaceView;
import android.widget.TextView;

import com.ti.omap.android.multidispapp.DDPresentation;
import com.ti.omap.android.multidispapp.PresentationContents;
import com.ti.omap.android.multidispapp.R;

public class GraphicPresentation extends DDPresentation {
    private TextView mCmdTextView;
    private SurfaceHolder mHolder;

    private CircleDrawer mDrawer;

    public GraphicPresentation(Context outerContext, Display display,
            PresentationContents pContents) {
        super(outerContext, display, pContents);
        setContentView(R.layout.graphics);

        mCmdTextView = (TextView) findViewById(R.id.cmd_log);
        SurfaceView sv = (SurfaceView) findViewById(R.id.surface_graphics);

        mHolder = sv.getHolder();
        mHolder.addCallback(new Callback() {
            @Override
            public void surfaceDestroyed(SurfaceHolder holder) {
                mDrawer.changeSize(0, 0);
            }

            @Override
            public void surfaceCreated(SurfaceHolder holder) {
                mDrawer.changeSize(0, 0);
            }

            @Override
            public void surfaceChanged(SurfaceHolder holder, int format,
                    int width, int height) {
                mDrawer.changeSize(height, width);
                if (width != 0 && height != 0) {
                    draw();
                }
            }
        });
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mDrawer = new CircleDrawer(savedInstanceState);
    }

    @Override
    public Bundle onSaveInstanceState() {
        Bundle saveStateBundle = super.onSaveInstanceState();
        mDrawer.saveState(saveStateBundle);
        return saveStateBundle;
    }

    @Override
    public void onCommand(Bundle cmd) {
        final int commandCode = cmd.getInt(GraphicControllerFragment.FIELD_CMD);
        if (GraphicControllerFragment.isCmdMove(commandCode)) {
            makeMoveCmd(commandCode);
        } else if (GraphicControllerFragment.isCmdColor(commandCode)) {
            makeColorCmd(commandCode);
        }

        if (mCmdTextView != null) {
            mCmdTextView.post(new Runnable() {
                @Override
                public void run() {
                    StringBuilder sb = new StringBuilder();
                    sb.append(GraphicControllerFragment
                            .cmdToString(commandCode));
                    sb.append(" (");
                    sb.append(commandCode);
                    sb.append(')');
                    mCmdTextView.setText(sb.toString());
                }
            });
        }
    }

    private void makeMoveCmd(int cmd) {
        mDrawer.makeStep(cmd);
        draw();
    }

    private void makeColorCmd(int cmd) {
        mDrawer.setColor(cmd);
        draw();
    }

    private void draw() {
        if (mHolder != null) {
            Canvas canvas = mHolder.lockCanvas();
            mDrawer.drawIt(canvas);
            mHolder.unlockCanvasAndPost(canvas);
        }
    }
}
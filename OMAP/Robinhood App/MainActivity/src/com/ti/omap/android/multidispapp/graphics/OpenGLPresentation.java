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
import android.widget.TextView;

import com.ti.omap.android.multidispapp.DDPresentation;
import com.ti.omap.android.multidispapp.PresentationContents;
import com.ti.omap.android.multidispapp.R;

public class OpenGLPresentation extends DDPresentation {

    private GLSurfaceView mSurfaceView;
    private TextView mCmdTextView;

    // @Override
    public OpenGLPresentation(Context outerContext, Display display,
            PresentationContents pContents) {
        super(outerContext, display, pContents);
        setContentView(R.layout.graphics_gl);

        mCmdTextView = (TextView) findViewById(R.id.cmd_log);
        mSurfaceView = (GLSurfaceView) findViewById(R.id.surface_graphics_gl);
        mSurfaceView.setRenderer(new GLDrawer());
    }

    @Override
    public void onCommand(Bundle cmd) {
        final int commandCode = cmd.getInt(GraphicControllerFragment.FIELD_CMD);

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
}
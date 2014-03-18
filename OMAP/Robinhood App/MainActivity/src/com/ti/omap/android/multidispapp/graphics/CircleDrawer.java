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

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.os.Bundle;

public class CircleDrawer {

    final private static String FIELD_COLOR_BACKGROUND = "colorback";
    final private static String FIELD_COLOR_FOREGROUND = "colorfore";
    final private static String FIELD_SHIFT_X = "xcenter";
    final private static String FIELD_SHIFT_Y = "ycenter";

    final private static float STEP_SIZE = 10.0f;

    private Object mLock = new Object();
    private int mBackgroundColor;
    private int mForegroundColor;
    private float mX;
    private float mY;
    private float mCenterX;
    private float mCenterY;

    public CircleDrawer() {
        mX = 0.0f;
        mY = 0.0f;
        mBackgroundColor = getBackgroundColorForCmd(GraphicControllerFragment.CMD_GREEN);
        mForegroundColor = getBackgroundColorForCmd(GraphicControllerFragment.CMD_GREEN);
    }

    public CircleDrawer(Bundle savedState) {
        if (savedState != null) {
            mX = savedState.getFloat(FIELD_SHIFT_X, 0.0f);
            mY = savedState.getFloat(FIELD_SHIFT_Y, 0.0f);
            mBackgroundColor = savedState
                    .getInt(FIELD_COLOR_BACKGROUND,
                            getBackgroundColorForCmd(GraphicControllerFragment.CMD_GREEN));
            mForegroundColor = savedState
                    .getInt(FIELD_COLOR_FOREGROUND,
                            getForegroundColorForCmd(GraphicControllerFragment.CMD_GREEN));
        } else {
            mX = 0.0f;
            mY = 0.0f;
            mBackgroundColor = getBackgroundColorForCmd(GraphicControllerFragment.CMD_GREEN);
            mForegroundColor = getForegroundColorForCmd(GraphicControllerFragment.CMD_GREEN);
        }
    }

    public void saveState(Bundle state) {
        state.putFloat(FIELD_SHIFT_X, mX);
        state.putFloat(FIELD_SHIFT_Y, mY);
        state.putInt(FIELD_COLOR_BACKGROUND, mBackgroundColor);
        state.putInt(FIELD_COLOR_FOREGROUND, mForegroundColor);
    }

    public void setColor(int color) {
        synchronized (mLock) {
            mBackgroundColor = getBackgroundColorForCmd(color);
            mForegroundColor = getForegroundColorForCmd(color);
        }
    }

    public void changeSize(int height, int width) {
        if (height < 0 || width < 0) {
            return;
        }

        synchronized (mLock) {
            mCenterX = width / 2.0f;
            mCenterY = height / 2.0f;
        }
    }

    public void makeStep(int dir) {
        synchronized (mLock) {
            switch (dir) {
            case ButtonsCtrl.CMD_CENTER:
                mX = 0;
                mY = 0;
                break;
            case ButtonsCtrl.CMD_UP:
                mY -= STEP_SIZE;
                break;
            case ButtonsCtrl.CMD_DOWN:
                mY += STEP_SIZE;
                break;
            case ButtonsCtrl.CMD_LEFT:
                mX -= STEP_SIZE;
                break;
            case ButtonsCtrl.CMD_RIGHT:
                mX += STEP_SIZE;
                break;
            }
        }
    }

    public void drawIt(Canvas canvas) {
        synchronized (mLock) {
            canvas.drawColor(mBackgroundColor);
            drawTriangle(canvas);
        }
    }

    private void drawTriangle(Canvas canvas) {
        Paint paint = new Paint();
        paint.setColor(mForegroundColor);

        canvas.drawCircle(mX + mCenterX, mY + mCenterY, 100.0f, paint);
    }

    private int getBackgroundColorForCmd(int color) {
        switch (color) {
        case GraphicControllerFragment.CMD_RED:
            return Color.RED;
        case GraphicControllerFragment.CMD_GREEN:
            return Color.GREEN;
        case GraphicControllerFragment.CMD_YELLOW:
            return Color.YELLOW;
        case GraphicControllerFragment.CMD_BLUE:
            return Color.BLUE;
        }
        throw new IllegalArgumentException("Can't convert to color: " + color);
    }

    private int getForegroundColorForCmd(int color) {
        switch (color) {
        case GraphicControllerFragment.CMD_RED:
            return Color.GREEN;
        case GraphicControllerFragment.CMD_GREEN:
            return Color.RED;
        case GraphicControllerFragment.CMD_YELLOW:
            return Color.BLUE;
        case GraphicControllerFragment.CMD_BLUE:
            return Color.YELLOW;
        }
        throw new IllegalArgumentException("Can't convert to color: " + color);
    }

}

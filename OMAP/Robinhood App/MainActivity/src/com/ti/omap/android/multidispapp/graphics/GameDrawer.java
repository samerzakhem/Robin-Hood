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

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

import android.content.Context;
import android.opengl.GLSurfaceView.Renderer;
import android.opengl.GLU;
import android.util.FloatMath;

public class GameDrawer implements Renderer {

    /*
     * Wrapper for all transformation variables.
     */
    final private static class TrWrap {
        double phi;
        double theta;
        float thetaAxisX;
        float thetaAxisY;
        float degPhi;
        float degTheta;

        public void refresh() {
            phi %= 2 * Math.PI;
            theta %= 2 * Math.PI;

            thetaAxisX = FloatMath.cos((float) phi);
            thetaAxisY = FloatMath.sin((float) phi);
            degPhi = (float) Math.toDegrees(phi);
            degTheta = (float) Math.toDegrees(theta);
        }
    }

    private int mWidth;
    private int mHeight;
    private TrWrap mTf;

    private TunnelDrawer mTunnel;

    public GameDrawer(Context context) {
        mTf = new TrWrap();
        mTunnel = new TunnelDrawer(1.5f, 80);
    }

    public void setRotation(double phi, double theta) {
        synchronized (mTf) {
            mTf.phi = phi;
            mTf.theta = theta;
            mTf.refresh();
        }
    }

    public void rotate(double dPhi, double dTheta) {
        synchronized (mTf) {
            mTf.phi += dPhi;
            mTf.theta += dTheta;
            mTf.refresh();
        }
    }

    public void addTurn(int turn) {
        mTunnel.addTurn(turn);
    }

    @Override
    public void onDrawFrame(GL10 gl) {
        gl.glClear(GL10.GL_COLOR_BUFFER_BIT | GL10.GL_DEPTH_BUFFER_BIT);

        gl.glLoadIdentity();
        synchronized (mTf) {
            gl.glScalef(0.25f, 0.25f, 1.0f);
            gl.glTranslatef(0.0f, 0.0f, -4.0f);
            gl.glRotatef(mTf.degPhi, 0.0f, 0.0f, 1.0f);
            gl.glRotatef(mTf.degTheta, mTf.thetaAxisX, mTf.thetaAxisY, 0.0f);
        }

        gl.glPushMatrix();
        mTunnel.draw(gl);
        gl.glPopMatrix();
    }

    @Override
    public void onSurfaceChanged(GL10 gl, int width, int height) {
        if (mWidth != width || mHeight != height) {
            if (height == 0)
                height = 1;
            mWidth = width;
            mHeight = height;

            gl.glViewport(0, 0, width, height);

            // make adjustments for screen ratio
            float ratio = (float) width / height;
            gl.glMatrixMode(GL10.GL_PROJECTION);
            gl.glLoadIdentity();
            GLU.gluPerspective(gl, 45, ratio, 0.1f, 100.f);

            gl.glMatrixMode(GL10.GL_MODELVIEW);
            gl.glLoadIdentity();
        }
    }

    @Override
    public void onSurfaceCreated(GL10 gl, EGLConfig config) {
        mHeight = 0;
        mWidth = 0;
        gl.glClearColor(0.1f, 0.1f, 0.1f, 1.0f); // Set color's clear-value to
                                                 // black
        gl.glClearDepthf(1.0f); // Set depth's clear-value to farthest
        gl.glEnable(GL10.GL_DEPTH_TEST); // Enables depth-buffer for hidden
                                         // surface removal
        gl.glDepthFunc(GL10.GL_LEQUAL); // The type of depth testing to do
        gl.glHint(GL10.GL_PERSPECTIVE_CORRECTION_HINT, GL10.GL_NICEST); // nice
                                                                        // perspective
                                                                        // view
        gl.glShadeModel(GL10.GL_SMOOTH); // Enable smooth shading of color
        gl.glDisable(GL10.GL_DITHER); // Disable dithering for better
                                      // performance
    }

}

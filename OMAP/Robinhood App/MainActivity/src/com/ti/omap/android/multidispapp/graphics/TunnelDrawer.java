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

import java.util.LinkedList;

import javax.microedition.khronos.opengles.GL10;

import com.ti.omap.android.multidispapp.graphics.Sections.Section;
import com.ti.omap.android.multidispapp.graphics.Sections.SectionsBuilder;

public class TunnelDrawer {

    final private int MAX_PLANNED_SECTIONS_COUNT = 20;

    private GameDroid mDroid;

    private SectionsBuilder mBuilder;
    private Object mLock = new Object();
    private LinkedList<Section> mSections = new LinkedList<Section>();
    private LinkedList<Section> mPlannedSections = new LinkedList<Section>();;
    final private int mFrames;
    private int mCurrentFrame;

    public TunnelDrawer(float radius, int framesPerSection) {
        mDroid = new GameDroid();
        mFrames = framesPerSection;
        mCurrentFrame = 0;
        mBuilder = Sections.getBuilderInstance(radius, 20, 10);
        initSections();
    }

    private void initSections() {
        synchronized (mLock) {
            for (int i = 0; i < 10; i++) {
                mSections.add(mBuilder.buildSection(Sections.NO_TURN));
            }
        }
    }

    public void draw(GL10 gl) {
        float pos = 1.0f * mCurrentFrame / mFrames;

        gl.glPushMatrix();
        gl.glTranslatef(0.0f, 0.0f, -2.0f);
        gl.glScalef(0.5f, 0.5f, 0.5f);
        mDroid.draw(gl);
        gl.glPopMatrix();

        gl.glPushMatrix();
        gl.glScalef(1.0f, 1.0f, -1.0f);
        gl.glTranslatef(0.0f, 0.0f, -pos);
        synchronized (mLock) {
            Section section = mSections.get(0);
            section.draw(gl, pos);
            makeTurn(section, gl);
            gl.glTranslatef(0.0f, 0.0f, 1.0f);
            int sectionsCount = mSections.size();
            for (int i = 1; i < sectionsCount; i++) {
                section = mSections.get(i);
                section.draw(gl, 0.0f);
                makeTurn(section, gl);
                gl.glTranslatef(0.0f, 0.0f, 1.0f);
            }
        }
        gl.glPopMatrix();

        ++mCurrentFrame;
        if (mCurrentFrame >= mFrames) {
            mCurrentFrame = 0;
            updateSections();
        }
    } // draw(GL10 gl)

    private void updateSections() {
        synchronized (mLock) {
            if (mSections.size() > 0) {
                mSections.remove();
                if (mPlannedSections.size() > 0) {
                    Section planSection = mPlannedSections.remove();
                    mSections.add(planSection);
                } else {
                    mSections.add(mBuilder.buildSection(Sections.NO_TURN));
                }
            }
        } // synchronized
    }

    private void makeTurn(Section section, GL10 gl) {
        int direction = section.mDirection;
        float shift = section.mBuilder.getmRadius();
        switch (direction) {
        case Sections.EMPTY_SECTION:
        case Sections.NO_TURN:
            break;
        case Sections.TURN_UP:
            gl.glRotatef(-90.0f, 1.0f, 0.0f, 0.0f);
            gl.glTranslatef(0.0f, -shift, shift - 1.0f);
            break;
        case Sections.TURN_DOWN:
            gl.glRotatef(90.0f, 1.0f, 0.0f, 0.0f);
            gl.glTranslatef(0.0f, shift, shift - 1.0f);
            break;
        case Sections.TURN_LEFT:
            gl.glRotatef(-90.0f, 0.0f, 1.0f, 0.0f);
            gl.glTranslatef(shift, 0.0f, shift - 1.0f);
            break;
        case Sections.TURN_RIGHT:
            gl.glRotatef(90.0f, 0.0f, 1.0f, 0.0f);
            gl.glTranslatef(-shift, 0.0f, shift - 1.0f);
            break;
        default:
            throw new IllegalStateException("Unhandled turn for direction: "
                    + direction);
        }
    }

    /**
     * Add turn to queue.
     *
     * @param turn
     *            turn direction: {@link TunnelDrawer#NO_TURN},
     *            {@link TunnelDrawer#TURN_UP}, {@link TunnelDrawer#TURN_DOWN},
     *            {@link TunnelDrawer#TURN_LEFT},
     *            {@link TunnelDrawer#TURN_RIGHT}.
     * @return <code>true</code> if turn was successfully added,
     *         <code>false</code> if planned turn queue has been filled
     */
    public boolean addTurn(int turn) {
        synchronized (mLock) {
            if (mPlannedSections.size() < MAX_PLANNED_SECTIONS_COUNT) {
                Section newSection = mBuilder.buildSection(turn);
                if (newSection != null) {
                    mPlannedSections.add(newSection);
                }
                return true;
            } else {
                return false;
            }
        }
    }

}

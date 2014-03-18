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

import java.nio.Buffer;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;

import javax.microedition.khronos.opengles.GL10;

import android.util.FloatMath;
import android.util.SparseArray;

class Sections {
    private Sections() {
    }

    final public static int NO_TURN = 0;
    final public static int TURN_UP = 1;
    final public static int TURN_DOWN = 2;
    final public static int TURN_LEFT = 3;
    final public static int TURN_RIGHT = 4;
    final public static int EMPTY_SECTION = 5; // for debug only

    public static SectionsBuilder getBuilderInstance(float tubeRadius,
            int linesCount, int circlesPerSection) {
        if (tubeRadius <= 0.0f) {
            throw new IllegalArgumentException("Tube radius should be greater "
                    + "that zero, but it's: " + tubeRadius);
        }
        if (linesCount % 4 != 0) {
            throw new IllegalArgumentException(
                    "Lines count should be multiple " + "of 4, but it's: "
                            + linesCount);
        }
        if (circlesPerSection <= 0) {
            throw new IllegalArgumentException(
                    "Circles per section should be more "
                            + "that zero, but it's: " + circlesPerSection);
        }

        SectionsBuilder builder = new SectionsBuilder(tubeRadius, linesCount,
                circlesPerSection);
        return builder;
    }

    final public static class SectionsBuilder {
        final private float mRadius;
        final private int mLinesCount;
        final private int mCirclesPerSection;

        private SectionsBuilder(float tubeRadius, int linesCount,
                int circlesPerSection) {
            mRadius = tubeRadius;
            mLinesCount = linesCount;
            mCirclesPerSection = circlesPerSection;
        }

        public float getmRadius() {
            return mRadius;
        }

        public Section buildSection(int direction) {
            switch (direction) {
            case NO_TURN:
                return new StraightSection(this);
            case TURN_UP:
            case TURN_DOWN:
            case TURN_LEFT:
            case TURN_RIGHT:
                return new CurveSection(direction, this);
            case EMPTY_SECTION:
                return new EmptySection(this);
            }

            throw new IllegalArgumentException(
                    "No section type specified for direction: " + direction);
        }
    }

    public static abstract class Section {
        final int mDirection;
        final SectionsBuilder mBuilder;

        protected Section(int direction, SectionsBuilder builder) {
            mDirection = direction;
            mBuilder = builder;
        }

        /**
         * @param gl
         * @param position
         *            value in range [0, 1)
         */
        public abstract void draw(GL10 gl, float position);

        public float getRoll(float t) {
            return 0.0f;
        }

        public float getYaw(float t) {
            return 0.0f;
        }

        public float getX(float t) {
            return 0.0f;
        }

        public float getY(float t) {
            return 0.0f;
        }
    }

    private static class EmptySection extends Section {
        private EmptySection(SectionsBuilder builder) {
            super(EMPTY_SECTION, builder);
        }

        @Override
        public void draw(GL10 gl, float position) {
        }
    }

    private static class StraightSection extends Section {
        private Circle mCircle;
        private Line mLine;
        private float miniStep;
        private float miniAngle;

        public StraightSection(SectionsBuilder builder) {
            super(NO_TURN, builder);

            int circlesCount = builder.mCirclesPerSection;
            miniStep = 1.0f / circlesCount;
            miniAngle = 360.0f / builder.mLinesCount;
            mCircle = Circle.getInstance(builder.mRadius);
            mLine = new Line(1.0f);
        }

        @Override
        public void draw(GL10 gl, float position) {
            gl.glPushMatrix();
            int visibleCount = (int) ((1.0f - position) / miniStep);
            // float miniShift = (1.0f - position) % miniStep;
            gl.glTranslatef(0.0f, 0.0f, 1.0f);
            for (int i = 0; i < visibleCount; i++) {
                mCircle.draw(gl);
                gl.glTranslatef(0.0f, 0.0f, -miniStep);
            }
            gl.glPopMatrix();

            gl.glPushMatrix();
            int linesCount = mBuilder.mLinesCount;
            float radius = mBuilder.mRadius;
            for (int i = 0; i < linesCount; i++) {
                gl.glRotatef(miniAngle, 0.0f, 0.0f, 1.0f);

                gl.glPushMatrix();
                gl.glTranslatef(radius, 0.0f, position);
                gl.glScalef(1.0f, 1.0f, 1.0f - position);
                mLine.draw(gl);
                gl.glPopMatrix();
            }
            gl.glPopMatrix();
        }

        @Override
        public float getY(float t) {
            return t;
        }
    }

    private static class CurveSection extends Section {
        final private static float MAX_ROLL = 45.0f;
        final private Circle mCircle;
        final private CurveEdge[] mEdges;
        private float[] mEdgesX;
        private float[] mEdgesY;
        final private float mPrimaryAngle;
        final private float mCurveRadius;

        public CurveSection(int direction, SectionsBuilder builder) {
            super(direction, builder);
            mCurveRadius = 1.0f * builder.mRadius; // TODO
            int edgesCount = builder.mLinesCount;
            mCircle = Circle.getInstance(mCurveRadius);
            mEdges = new CurveEdge[edgesCount];
            mEdgesX = new float[edgesCount];
            mEdgesY = new float[edgesCount];
            for (int i = 0; i < edgesCount; i++) {
                double angle = 2 * Math.PI * i / edgesCount;
                mEdgesX[i] = mCurveRadius * FloatMath.cos((float) angle);
                mEdgesY[i] = mCurveRadius * FloatMath.sin((float) angle);
                float curveRadius = mCurveRadius + mEdgesY[i];
                mEdges[i] = CurveEdge.getInstance(curveRadius, i);
            }
            mPrimaryAngle = getPrimaryAngle(direction);
        }

        @Override
        public float getRoll(float t) {
            return 4.0f * t * (t - 1.0f) * MAX_ROLL;
        }

        @Override
        public float getYaw(float t) {
            return calcAngle(t);
        }

        @Override
        public float getX(float t) {
            return calcX(t, mCurveRadius);
        }

        @Override
        public float getY(float t) {
            return calcX(t, mCurveRadius);
        }

        private static float getPrimaryAngle(int direction) {
            switch (direction) {
            case TURN_UP:
                return 90.0f;
            case TURN_DOWN:
                return 270.0f;
            case TURN_LEFT:
                return 180.0f;
            case TURN_RIGHT:
                return 0.0f;
            }
            throw new IllegalArgumentException("Not supported direction: "
                    + direction);
        }

        private static float calcAngle(float t) {
            double angrad = Math.atan2(t, 1 - t);
            return (float) Math.toDegrees(angrad);
        }

        private static float calcX(float t, float radius) {
            return radius * t * t;
        }

        private static float calcZ(float t, float radius) {
            return radius * t * (2.0f - t);
        }

        @Override
        public void draw(GL10 gl, float position) {
            gl.glPushMatrix();
            gl.glRotatef(mPrimaryAngle, 0.0f, 0.0f, 1.0f);
            int circlesCount = mBuilder.mCirclesPerSection;
            float radius = mCurveRadius;
            for (int i = 0; i < circlesCount; i++) {
                float t = 1.0f * i / circlesCount;
                gl.glPushMatrix();
                float z = calcZ(t, radius);
                float x = calcX(t, radius);
                gl.glTranslatef(x, 0.0f, z);
                float angle = calcAngle(t);
                gl.glRotatef(angle, 0.0f, 1.0f, 0.0f);
                mCircle.draw(gl);
                gl.glPopMatrix();
            }

            int edgeCount = mBuilder.mLinesCount;
            for (int i = 0; i < edgeCount; i++) {
                gl.glPushMatrix();
                gl.glRotatef(90.0f, 0.0f, 0.0f, 1.0f);
                gl.glTranslatef(mEdgesX[i], mEdgesY[i], 0.0f);
                gl.glRotatef(180.0f, 0.0f, 0.0f, 1.0f);
                gl.glRotatef(90.0f, 0.0f, 1.0f, 0.0f);
                mEdges[i].draw(gl);
                gl.glPopMatrix();
            }
            gl.glPopMatrix();
        }
    }

    private static class Circle {
        final private static int VERTEX_COUNT = 64;
        final private float mCircleRadius;
        private FloatBuffer mVertexBuffer;
        private Buffer mIndexBuffer;

        private static Circle sCircle;

        synchronized public static Circle getInstance(float circleRadius) {
            if (sCircle == null) {
                sCircle = new Circle(circleRadius);
            }
            return sCircle;
        }

        private Circle(float circleRadius) {
            mCircleRadius = circleRadius;
            initVertexes();
            initIndexes();
        }

        private void initVertexes() {
            float[] vertices = new float[VERTEX_COUNT * 3];
            vertices[0] = mCircleRadius;
            vertices[1] = 0.0f;
            vertices[2] = 0.0f;
            for (int i = 1, pos = 3, last = (VERTEX_COUNT / 4 - 1) * 3; i < VERTEX_COUNT / 8; i++, pos += 3, last -= 3) {
                float angle = (float) (2 * Math.PI / VERTEX_COUNT * i);
                float cosVal = mCircleRadius * FloatMath.cos(angle);
                float sinVal = mCircleRadius * FloatMath.sin(angle);
                vertices[pos] = cosVal;
                vertices[pos + 1] = sinVal;
                vertices[pos + 2] = 0.0f;
                vertices[last] = sinVal;
                vertices[last + 1] = cosVal;
                vertices[last + 2] = 0.0f;
            }
            vertices[VERTEX_COUNT / 8 * 3] = mCircleRadius
                    * FloatMath.cos((float) (Math.PI / 4));
            vertices[VERTEX_COUNT / 8 * 3 + 1] = vertices[VERTEX_COUNT / 8 * 3];
            vertices[VERTEX_COUNT / 8 * 3 + 2] = 0.0f;

            // copy from [0, pi/2] to [pi/2, pi]
            for (int i = 0, from = 0, to = VERTEX_COUNT / 4 * 3; i < VERTEX_COUNT / 4; i++, from += 3, to += 3) {
                vertices[to] = -vertices[from + 1]; // copy y to x
                vertices[to + 1] = vertices[from]; // comy -y to x
                vertices[to + 2] = vertices[from + 2];
            }

            // copy from [0, pi] to [pi, 2*pi]
            for (int i = 0, from = 0, to = VERTEX_COUNT / 2 * 3; i < VERTEX_COUNT / 2; i++, from += 3, to += 3) {
                vertices[to] = -vertices[from];
                vertices[to + 1] = -vertices[from + 1];
                vertices[to + 2] = vertices[from + 2];
            }

            ByteBuffer vbb = ByteBuffer.allocateDirect(VERTEX_COUNT * 3 * 4);
            vbb.order(ByteOrder.nativeOrder());
            mVertexBuffer = vbb.asFloatBuffer();
            mVertexBuffer.put(vertices);
            mVertexBuffer.position(0);
        }

        private void initIndexes() {
            byte ind[] = new byte[VERTEX_COUNT];
            for (byte i = 0; i < VERTEX_COUNT; i++) {
                ind[i] = i;
            }
            ByteBuffer buffer = ByteBuffer.allocateDirect(VERTEX_COUNT);
            buffer.put(ind);
            mIndexBuffer = buffer;
            mIndexBuffer.position(0);
        }

        public void draw(GL10 gl) {
            gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
            gl.glVertexPointer(3, GL10.GL_FLOAT, 0, mVertexBuffer);
            gl.glDrawElements(GL10.GL_LINE_LOOP, VERTEX_COUNT,
                    GL10.GL_UNSIGNED_BYTE, mIndexBuffer);
            gl.glDisableClientState(GL10.GL_VERTEX_ARRAY);
        }
    }

    private static class Line {
        private FloatBuffer mVertexBuffer;
        private Buffer mIndexBuffer;

        public Line(float length) {
            ByteBuffer vbb = ByteBuffer.allocateDirect(2 * 3 * 4);
            vbb.order(ByteOrder.nativeOrder());
            mVertexBuffer = vbb.asFloatBuffer();
            mVertexBuffer.put(new float[] { 0.0f, 0.0f, 0.0f, 0.0f, 0.0f,
                    length });
            mVertexBuffer.position(0);

            ByteBuffer buffer = ByteBuffer.allocateDirect(2);
            buffer.put(new byte[] { 0, 1 });
            mIndexBuffer = buffer;
            mIndexBuffer.position(0);
        }

        public void draw(GL10 gl) {
            gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
            gl.glVertexPointer(3, GL10.GL_FLOAT, 0, mVertexBuffer);
            gl.glDrawElements(GL10.GL_LINES, 2, GL10.GL_UNSIGNED_BYTE,
                    mIndexBuffer);
            gl.glDisableClientState(GL10.GL_VERTEX_ARRAY);
        }
    }

    private static class CurveEdge {
        final private static int VERTEX_COUNT = 16;
        float mCurveRadius;
        private FloatBuffer mVertexBuffer;
        private Buffer mIndexBuffer;

        private static SparseArray<CurveEdge> sEdges = new SparseArray<CurveEdge>();;

        synchronized static CurveEdge getInstance(float radius, int index) {
            CurveEdge edge = sEdges.get(index);
            if (edge == null) {
                edge = new CurveEdge(radius);
                sEdges.put(index, edge);
            }
            return edge;
        }

        public CurveEdge(float radius) {
            mCurveRadius = radius;
            float[] edgeVertex = new float[VERTEX_COUNT * 2];
            for (int i = 0, pos = 2 * i; i < VERTEX_COUNT; i++, pos += 2) {
                float t = i / (VERTEX_COUNT - 1.0f);
                edgeVertex[pos] = mCurveRadius * t * (t - 2.0f);
                edgeVertex[pos + 1] = mCurveRadius * t * t;
            }
            ByteBuffer vbb = ByteBuffer.allocateDirect(VERTEX_COUNT * 2 * 4);
            vbb.order(ByteOrder.nativeOrder());
            mVertexBuffer = vbb.asFloatBuffer();
            mVertexBuffer.put(edgeVertex);
            mVertexBuffer.position(0);

            byte[] edgeIndex = new byte[VERTEX_COUNT];
            for (byte i = 0; i < VERTEX_COUNT; i++)
                edgeIndex[i] = i;
            ByteBuffer buffer = ByteBuffer.allocateDirect(VERTEX_COUNT);
            buffer.put(edgeIndex);
            mIndexBuffer = buffer;
            mIndexBuffer.position(0);
        }

        public void draw(GL10 gl) {
            gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
            gl.glVertexPointer(2, GL10.GL_FLOAT, 0, mVertexBuffer);
            gl.glDrawElements(GL10.GL_LINE_STRIP, VERTEX_COUNT,
                    GL10.GL_UNSIGNED_BYTE, mIndexBuffer);
            gl.glDisableClientState(GL10.GL_VERTEX_ARRAY);
        }
    }

}

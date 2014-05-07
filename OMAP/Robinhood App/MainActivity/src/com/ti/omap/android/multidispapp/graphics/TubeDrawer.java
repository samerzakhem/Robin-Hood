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
import java.util.Arrays;

import javax.microedition.khronos.opengles.GL10;

import android.util.FloatMath;

@SuppressWarnings("unused")
public class TubeDrawer {

    final private static int EDGES_COUNT = 20;

    public static class TubeBuilder {
        private float tubeRadius = 1.0f;
        private float zOrders[] = new float[] { 0.0f };
        private float startZ;
        private float endZ;
        private float stepZ;
        private int countZ;
        private int ministepsCount;

        private TubeBuilder() {
        }

        public TubeBuilder setRadius(float radius) {
            tubeRadius = radius;
            return this;
        }

        public TubeBuilder setZOrder(float z) {
            zOrders = new float[] { z };
            return this;
        }

        public TubeBuilder setZOrders(float from, float to, int count) {
            if (count <= 1) {
                throw new IllegalArgumentException(
                        "Circles count should be greater that 1."
                                + "If you need only single circle tube - use setZOrder(float z) instead.");
            }

            zOrders = new float[count];
            for (int i = 0; i < count; i++) {
                zOrders[i] = (count - 1 - i) * from + i * to;
                zOrders[i] /= count - 1;
            }

            startZ = from;
            endZ = to;
            countZ = count;
            stepZ = count >= 2 ? (endZ - startZ) / (count - 1) : 0.0f;
            return this;
        }

        public TubeBuilder setZOrders(float first, int count, float step) {
            if (count <= 1) {
                throw new IllegalArgumentException(
                        "Circles count should be greater that 1."
                                + "If you need only single circle tube - use setZOrder(float z) instead.");
            }
            zOrders = new float[count];
            for (int i = 0; i < count; i++) {
                zOrders[i] = first + i * step;
            }

            startZ = first;
            endZ = first + step * count;
            countZ = count;
            stepZ = step;
            return this;
        }

        public TubeBuilder setMinistepsCount(int ministepsCount) {
            this.ministepsCount = ministepsCount;
            return this;
        }

        public TubeDrawer build() {
            TubeDrawer drawer = new TubeDrawer(this);
            return drawer;
        }
    }

    public static TubeBuilder getBuilder() {
        return new TubeBuilder();
    }

    private Circle mCircle;
    private Edge[] mEdges;
    private float[] mEdgesX;
    private float[] mEdgesY;

    private float mZs[];
    final private TubeBuilder mBuilder;
    private float miniStep;
    private int miniStepIndex;
    final private float mCurveRadius;
    final private float mCurveLimit;

    private TubeDrawer(TubeBuilder builder) {
        mBuilder = builder;

        mZs = Arrays.copyOf(builder.zOrders, builder.countZ);
        miniStep = -builder.stepZ / builder.ministepsCount;
        miniStepIndex = 0;
        mCurveRadius = builder.tubeRadius * 2.2f;
        mCurveLimit = mBuilder.stepZ * 10;

        mCircle = new Circle(builder.tubeRadius);
        buildEdges();
    }

    private void buildEdges() {
        float radius = mBuilder.tubeRadius;
        mEdges = new Edge[EDGES_COUNT];
        mEdgesX = new float[EDGES_COUNT];
        mEdgesY = new float[EDGES_COUNT];
        for (int i = 0; i < EDGES_COUNT; i++) {
            double angle = 2 * Math.PI * i / EDGES_COUNT;
            mEdgesX[i] = radius * FloatMath.cos((float) angle);
            mEdgesY[i] = radius * FloatMath.sin((float) angle);
            mEdges[i] = new Edge(mCurveRadius + mEdgesY[i], mBuilder.startZ,
                    mBuilder.endZ, mCurveLimit);
        }
    }

    public void draw(GL10 gl) {

        int count = mBuilder.countZ;
        for (int i = 0; i < count; i++) {
            float x = 0.0f;
            float y = 0.0f;
            float z = mZs[i];
            float angle = 0.0f;
            boolean isRotate = false;

            gl.glPushMatrix();
            if (z >= 0.0f) {
                // do nothing
            } else {
                isRotate = true;
                if (z > mCurveLimit) {
                    float t = z / mCurveLimit;
                    angle = -getAngle(t);
                    y = -getY(t);
                    z = getZ(t);
                } else {
                    angle = -90.0f;
                    y = z - mCurveLimit - mCurveRadius;
                    z = -mCurveRadius;
                }
            }

            gl.glTranslatef(x, y, z);
            if (isRotate) {
                gl.glRotatef(angle, 1.0f, 0.0f, 0.0f);
            }
            mCircle.draw(gl);
            gl.glPopMatrix();
        }

        for (int i = 0; i < EDGES_COUNT; i++) {
            gl.glPushMatrix();
            gl.glTranslatef(mEdgesX[i], mEdgesY[i], 0.0f);
            gl.glRotatef(-90.0f, 0.0f, 1.0f, 0.0f);
            mEdges[i].draw(gl);
            gl.glPopMatrix();
        }

        // move for next step
        ++miniStepIndex;
        if (miniStepIndex >= mBuilder.ministepsCount) {
            for (int i = 0; i < count; i++) {
                mZs[i] = mBuilder.zOrders[i];
            }
            miniStepIndex = 0;
        } else {
            for (int i = 0; i < count; i++) {
                mZs[i] += miniStep;
            }
        }
    }

    private float getAngle(float t) {
        double angrad = Math.atan2(-t, t - 1);
        return (float) Math.toDegrees(angrad);
    }

    private float getY(float t) {
        return mCurveRadius * t * t;
    }

    private float getZ(float t) {
        return mCurveRadius * t * (t - 2.0f);
    }

    private static class Circle {
        final private static int VERTEX_COUNT = 64;

        final private float mCircleRadius;
        private FloatBuffer mVertexBuffer;
        float[] vertices = new float[VERTEX_COUNT * 3];
        private Buffer mIndexBuffer;
        static {
        	
            if (VERTEX_COUNT % 8 != 0 || VERTEX_COUNT <= 0
                    || VERTEX_COUNT >= 128)
                throw new IllegalArgumentException(
                        "Vertex count should be multiple "
                                + "of 8 and in range (0, 127]. You value is "
                                + VERTEX_COUNT);
        }

        public Circle(float circleRadius) {
            mCircleRadius = circleRadius;
            initVertexes();
            initIndexes();
        }

        private void initVertexes() {
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
            if (VERTEX_COUNT < 128) {
                byte ind[] = new byte[VERTEX_COUNT];
                for (byte i = 0; i < VERTEX_COUNT; i++) {
                    ind[i] = i;
                }
                ByteBuffer buffer = ByteBuffer.allocateDirect(VERTEX_COUNT);
                buffer.put(ind);
                mIndexBuffer = buffer;
                mIndexBuffer.position(0);
            } else {
                // TODO
            }
        }

        public void draw(GL10 gl) {
            gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
            gl.glVertexPointer(3, GL10.GL_FLOAT, 0, mVertexBuffer);
            gl.glDrawElements(GL10.GL_LINE_LOOP, VERTEX_COUNT,
                    GL10.GL_UNSIGNED_BYTE, mIndexBuffer);
            gl.glDisableClientState(GL10.GL_VERTEX_ARRAY);
        }
    }

    private static class Edge {
        final private static int CURVE_VERTEX_COUNT = 16;

        final private float mCurveRadius;
        final private float mCurveLimit;
        final private float mStartZ;
        final private float mStopZ;

        private int mCount;
        private FloatBuffer mVertexBuffer;
        private Buffer mIndexBuffer;

        public Edge(float curveRadius, float zStart, float zTo, float curveLimit) {
            mCurveRadius = curveRadius;
            mCurveLimit = curveLimit;
            mStartZ = zStart;
            mStopZ = zTo;

            mCount = 2;
            if (zTo < 0)
                mCount += CURVE_VERTEX_COUNT;
            if (zTo < -curveRadius)
                mCount += 1;

            fillVertex();
        }

        private void fillVertex() {
            float[] mVertex = new float[mCount * 2];
            byte[] mIndex = new byte[mCount];

            updateCurveVertex(mVertex);
            ByteBuffer vbb = ByteBuffer.allocateDirect(mCount * 3 * 4);
            vbb.order(ByteOrder.nativeOrder());
            mVertexBuffer = vbb.asFloatBuffer();
            mVertexBuffer.put(mVertex);
            mVertexBuffer.position(0);

            for (byte i = 0; i < mCount; i++)
                mIndex[i] = i;
            ByteBuffer buffer = ByteBuffer.allocateDirect(mCount);
            buffer.put(mIndex);
            mIndexBuffer = buffer;
            mIndexBuffer.position(0);
        }

        private void updateCurveVertex(float[] vertex) {
            vertex[0] = mStartZ;
            vertex[1] = 0.0f;
            vertex[2] = 0.0f;
            vertex[3] = 0.0f;
            if (mCount == 2) {
                return;
            }

            for (int i = 3, pos = 2 * i; i < 2 + CURVE_VERTEX_COUNT; i++, pos += 2) {
                float t = (i - 2.0f) / CURVE_VERTEX_COUNT;
                vertex[pos] = mCurveRadius * t * (t - 2.0f);
                vertex[pos + 1] = -mCurveRadius * t * t;
            }

            int limitIndex = 2 + CURVE_VERTEX_COUNT;
            if (mCount == limitIndex + 1) {
                vertex[limitIndex * 2] = -mCurveRadius;
                vertex[limitIndex * 2 + 1] = mStopZ - mCurveRadius
                        - mCurveLimit;
            }
        }

        public void draw(GL10 gl) {
            gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
            gl.glVertexPointer(2, GL10.GL_FLOAT, 0, mVertexBuffer);
            gl.glDrawElements(GL10.GL_LINE_STRIP, mCount,
                    GL10.GL_UNSIGNED_BYTE, mIndexBuffer);
            gl.glDisableClientState(GL10.GL_VERTEX_ARRAY);
        }
    }

}

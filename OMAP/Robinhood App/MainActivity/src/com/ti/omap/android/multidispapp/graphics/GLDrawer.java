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

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

import android.opengl.GLSurfaceView.Renderer;
import android.opengl.GLU;
import android.util.Log;

public class GLDrawer implements Renderer {

    final private static String TAG = "GlDrawer";

    private int mWidth;
    private int mHeight;
    private Pyramid pyramid;
    private Cube cube;

    // Rotational angle and speed
    private float angleTriangle = 0.0f;
    private float angleQuad = 0.0f;
    private float speedTriangle = 0.5f;
    private float speedQuad = -0.4f;

    boolean isLightingEnabled = false; // Is lighting on
    private float[] lightAmbient = { 0.5f, 0.5f, 0.5f, 1.0f };
    private float[] lightDiffuse = { 1.0f, 1.0f, 1.0f, 1.0f };
    private float[] lightPosition = { 0.0f, 0.0f, 2.0f, 1.0f };

    public GLDrawer() {
        pyramid = new Pyramid();
        cube = new Cube();
    }

    @Override
    public void onSurfaceCreated(GL10 gl, EGLConfig config) {
        Log.d(TAG, "onSurfaceCreated()");

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

        // Setup lighting GL_LIGHT1 with ambient and diffuse lights
        gl.glLightfv(GL10.GL_LIGHT1, GL10.GL_AMBIENT, lightAmbient, 0);
        gl.glLightfv(GL10.GL_LIGHT1, GL10.GL_DIFFUSE, lightDiffuse, 0);
        gl.glLightfv(GL10.GL_LIGHT1, GL10.GL_POSITION, lightPosition, 0);
        gl.glEnable(GL10.GL_LIGHT1); // Enable Light 1
        gl.glEnable(GL10.GL_LIGHT0); // Enable the default Light 0
    }

    @Override
    public void onSurfaceChanged(GL10 gl, int width, int height) {
        Log.d(TAG, "onSurfaceChanged(): w: " + width + ", h: " + height);
        if (mWidth != width || mHeight != height) {
            if (height == 0)
                height = 1;
            mWidth = width;
            mHeight = height;
            // XXX probably some recalculation will be needed

            gl.glViewport(0, 0, width, height);

            // make adjustments for screen ratio
            float ratio = (float) width / height;
            gl.glMatrixMode(GL10.GL_PROJECTION);
            gl.glLoadIdentity();
            // gl.glFrustumf(-ratio, ratio, -1, 1, 3, 7);
            GLU.gluPerspective(gl, 45, ratio, 0.1f, 100.f);

            gl.glMatrixMode(GL10.GL_MODELVIEW);
            gl.glLoadIdentity();
        }
    }

    @Override
    public void onDrawFrame(GL10 gl) {
        // Log.d(TAG, "onDrawFrame()");
        gl.glClear(GL10.GL_COLOR_BUFFER_BIT | GL10.GL_DEPTH_BUFFER_BIT);

        // Enable lighting? (NEW)
        if (isLightingEnabled) {
            gl.glEnable(GL10.GL_LIGHTING);
        } else {
            gl.glDisable(GL10.GL_LIGHTING);
        }

        gl.glLoadIdentity(); // Reset model-view matrix
        gl.glScalef(0.5f, 0.5f, 1.0f);
        gl.glTranslatef(-1.5f, 0.0f, -6.0f); // Translate left and into the
                                             // screen
        gl.glRotatef(angleTriangle, 0.0f, 1.0f, 0.0f); // Rotate the triangle
                                                       // about the y-axis
        pyramid.draw(gl); // Draw triangle

        // Translate right, relative to the previous translation
        gl.glLoadIdentity(); // Reset model-view matrix
        gl.glScalef(0.5f, 0.5f, 1.0f);
        gl.glTranslatef(1.5f, 0.0f, -6.0f); // Translate right and into the
                                            // screen
        gl.glRotatef(angleQuad, 1.0f, 0.0f, 0.0f); // Rotate the square about
                                                   // the x-axis
        cube.draw(gl);

        // Update the rotational angle after each refresh
        angleTriangle += speedTriangle;
        angleQuad += speedQuad;

    }

    public class Pyramid {
        private FloatBuffer vertexBuffer; // Buffer for vertex-array
        private FloatBuffer colorBuffer; // Buffer for color-array
        private ByteBuffer indexBuffer; // Buffer for index-array

        private float[] vertices = { // 5 vertices of the pyramid in (x,y,z)
        -1.0f, -1.0f, -1.0f, // 0. left-bottom-back
                1.0f, -1.0f, -1.0f, // 1. right-bottom-back
                1.0f, -1.0f, 1.0f, // 2. right-bottom-front
                -1.0f, -1.0f, 1.0f, // 3. left-bottom-front
                0.0f, 1.0f, 0.0f // 4. top
        };

        private float[] colors = { // Colors of the 5 vertices in RGBA
        0.0f, 0.0f, 1.0f, 1.0f, // 0. blue
                0.0f, 1.0f, 0.0f, 1.0f, // 1. green
                0.0f, 0.0f, 1.0f, 1.0f, // 2. blue
                0.0f, 1.0f, 0.0f, 1.0f, // 3. green
                1.0f, 0.0f, 0.0f, 1.0f // 4. red
        };

        private byte[] indices = { // Vertex indices of the 4 Triangles
        2, 4, 3, // front face (CCW)
                1, 4, 2, // right face
                0, 4, 1, // back face
                3, 4, 0, // left face
        };

        // Constructor - Set up the buffers
        public Pyramid() {
            // Setup vertex-array buffer. Vertices in float. An float has 4
            // bytes
            ByteBuffer vbb = ByteBuffer.allocateDirect(vertices.length * 4);
            vbb.order(ByteOrder.nativeOrder()); // Use native byte order
            vertexBuffer = vbb.asFloatBuffer(); // Convert from byte to float
            vertexBuffer.put(vertices); // Copy data into buffer
            vertexBuffer.position(0); // Rewind

            // Setup color-array buffer. Colors in float. An float has 4 bytes
            ByteBuffer cbb = ByteBuffer.allocateDirect(colors.length * 4);
            cbb.order(ByteOrder.nativeOrder());
            colorBuffer = cbb.asFloatBuffer();
            colorBuffer.put(colors);
            colorBuffer.position(0);

            // Setup index-array buffer. Indices in byte.
            indexBuffer = ByteBuffer.allocateDirect(indices.length);
            indexBuffer.put(indices);
            indexBuffer.position(0);
        }

        // Draw the shape
        public void draw(GL10 gl) {
            gl.glFrontFace(GL10.GL_CCW); // Front face in counter-clockwise
                                         // orientation
            gl.glRotatef(30.0f, 1.0f, 0.0f, 0.0f);

            // Enable arrays and define their buffers
            gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
            gl.glVertexPointer(3, GL10.GL_FLOAT, 0, vertexBuffer);
            gl.glEnableClientState(GL10.GL_COLOR_ARRAY);
            gl.glColorPointer(4, GL10.GL_FLOAT, 0, colorBuffer);

            gl.glDrawElements(GL10.GL_TRIANGLES, indices.length,
                    GL10.GL_UNSIGNED_BYTE, indexBuffer);

            gl.glDisableClientState(GL10.GL_VERTEX_ARRAY);
            gl.glDisableClientState(GL10.GL_COLOR_ARRAY);
        }
    }

    public class Cube {
        private FloatBuffer vertexBuffer; // Buffer for vertex-array
        private int numFaces = 6;

        private float[][] colors = { // Colors of the 6 faces
        { 1.0f, 0.5f, 0.0f, 1.0f }, // 0. orange
                { 1.0f, 0.0f, 1.0f, 1.0f }, // 1. violet
                { 0.0f, 1.0f, 0.0f, 1.0f }, // 2. green
                { 0.0f, 0.0f, 1.0f, 1.0f }, // 3. blue
                { 1.0f, 0.0f, 0.0f, 1.0f }, // 4. red
                { 1.0f, 1.0f, 0.0f, 1.0f } // 5. yellow
        };

        private float[] vertices = { // Vertices of the 6 faces
        // FRONT
                -1.0f, -1.0f, 1.0f, // 0. left-bottom-front
                1.0f, -1.0f, 1.0f, // 1. right-bottom-front
                -1.0f, 1.0f, 1.0f, // 2. left-top-front
                1.0f, 1.0f, 1.0f, // 3. right-top-front
                // BACK
                1.0f, -1.0f, -1.0f, // 6. right-bottom-back
                -1.0f, -1.0f, -1.0f, // 4. left-bottom-back
                1.0f, 1.0f, -1.0f, // 7. right-top-back
                -1.0f, 1.0f, -1.0f, // 5. left-top-back
                // LEFT
                -1.0f, -1.0f, -1.0f, // 4. left-bottom-back
                -1.0f, -1.0f, 1.0f, // 0. left-bottom-front
                -1.0f, 1.0f, -1.0f, // 5. left-top-back
                -1.0f, 1.0f, 1.0f, // 2. left-top-front
                // RIGHT
                1.0f, -1.0f, 1.0f, // 1. right-bottom-front
                1.0f, -1.0f, -1.0f, // 6. right-bottom-back
                1.0f, 1.0f, 1.0f, // 3. right-top-front
                1.0f, 1.0f, -1.0f, // 7. right-top-back
                // TOP
                -1.0f, 1.0f, 1.0f, // 2. left-top-front
                1.0f, 1.0f, 1.0f, // 3. right-top-front
                -1.0f, 1.0f, -1.0f, // 5. left-top-back
                1.0f, 1.0f, -1.0f, // 7. right-top-back
                // BOTTOM
                -1.0f, -1.0f, -1.0f, // 4. left-bottom-back
                1.0f, -1.0f, -1.0f, // 6. right-bottom-back
                -1.0f, -1.0f, 1.0f, // 0. left-bottom-front
                1.0f, -1.0f, 1.0f // 1. right-bottom-front
        };

        // Constructor - Set up the buffers
        public Cube() {
            // Setup vertex-array buffer. Vertices in float. An float has 4
            // bytes
            ByteBuffer vbb = ByteBuffer.allocateDirect(vertices.length * 4);
            vbb.order(ByteOrder.nativeOrder()); // Use native byte order
            vertexBuffer = vbb.asFloatBuffer(); // Convert from byte to float
            vertexBuffer.put(vertices); // Copy data into buffer
            vertexBuffer.position(0); // Rewind
        }

        // Draw the shape
        public void draw(GL10 gl) {
            gl.glFrontFace(GL10.GL_CCW); // Front face in counter-clockwise
                                         // orientation
            gl.glEnable(GL10.GL_CULL_FACE); // Enable cull face
            gl.glCullFace(GL10.GL_BACK); // Cull the back face (don't display)

            gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
            gl.glVertexPointer(3, GL10.GL_FLOAT, 0, vertexBuffer);

            // Render all the faces
            for (int face = 0; face < numFaces; face++) {
                // Set the color for each of the faces
                gl.glColor4f(colors[face][0], colors[face][1], colors[face][2],
                        colors[face][3]);
                // Draw the primitive from the vertex-array directly
                gl.glDrawArrays(GL10.GL_TRIANGLE_STRIP, face * 4, 4);
            }
            gl.glDisableClientState(GL10.GL_VERTEX_ARRAY);
            gl.glDisable(GL10.GL_CULL_FACE);
        }
    }

}

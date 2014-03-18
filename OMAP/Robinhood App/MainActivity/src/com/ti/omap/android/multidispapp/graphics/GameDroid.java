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

import javax.microedition.khronos.opengles.GL10;

public class GameDroid {

    private FloatBuffer vertexBuffer; // Buffer for vertex-array
    private FloatBuffer colorBuffer; // Buffer for color-array
    private ByteBuffer indexBuffer; // Buffer for index-array

    private float[] vertices = { // 5 vertices of the pyramid in (x,y,z)
           -1.0f, -1.0f, -1.0f, // 0. left-bottom-back
            1.0f, -1.0f, -1.0f, // 1. right-bottom-back
            1.0f, -1.0f,  1.0f, // 2. right-bottom-front
           -1.0f, -1.0f,  1.0f, // 3. left-bottom-front
            0.0f,  1.0f,  0.0f  // 4. top
    };

    private float[] colors = { // Colors of the 5 vertices in RGBA
            0.0f, 0.0f, 1.0f, 1.0f, // 0. blue
            0.0f, 1.0f, 0.0f, 1.0f, // 1. green
            0.0f, 0.0f, 1.0f, 1.0f, // 2. blue
            0.0f, 1.0f, 0.0f, 1.0f, // 3. green
            1.0f, 0.0f, 0.0f, 1.0f  // 4. red
    };

    private byte[] indices = { // Vertex indices of the 4 Triangles
            2, 4, 3, // front face (CCW)
            1, 4, 2, // right face
            0, 4, 1, // back face
            4, 0, 3  // left face
    };

    public GameDroid() {
        // Setup vertex-array buffer. Vertices in float. An float has 4 bytes
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
        gl.glFrontFace(GL10.GL_CCW);

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

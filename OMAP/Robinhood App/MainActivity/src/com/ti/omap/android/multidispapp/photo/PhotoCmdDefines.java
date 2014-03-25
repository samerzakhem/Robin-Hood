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
package com.ti.omap.android.multidispapp.photo;

final public class PhotoCmdDefines {
    private PhotoCmdDefines() {
    }

    final public static int SLIDESHOW_DELAY_VALUE = 1500;

    final public static String CMD = "cmd";

    final public static int CMD_UNDEFINED = -1;
    final public static int CMD_SHOW_PHOTO = 0;

    final public static String SLIDESHOW_URI = "slshUri";
    final public static String SLIDESHOW_POSITION = "slshPos";
    final public static String SLIDESHOW_TIMER = "slshTime";
    final public static String SLIDESHOW_SHIFT = "slshShift";

}

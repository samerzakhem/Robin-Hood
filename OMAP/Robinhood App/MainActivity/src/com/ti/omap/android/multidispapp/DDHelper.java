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
package com.ti.omap.android.multidispapp;

import android.view.View;
import android.view.View.OnClickListener;

final public class DDHelper {
    private DDHelper() {
    }

    final public static void registerClickListener(int id,
            OnClickListener listener, View parentView) {
        if (listener == null || parentView == null) {
            throw new NullPointerException("Listener or parent is null");
        }
        View view = parentView.findViewById(id);
        if (view == null) {
            throw new NullPointerException("Cannot find view in parent view");
        }

        view.setOnClickListener(listener);
    }

}

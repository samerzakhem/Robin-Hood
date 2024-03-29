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

import java.util.ArrayList;
import java.util.List;

import android.app.Fragment;
import android.view.Display;

public class PrimaryFragment extends Fragment {
    List<Display> mExternalDisplayList;

    public void setExtDispList(List<Display> extDispList) {
        mExternalDisplayList = new ArrayList<Display>(extDispList);
    }

    public int getDisplayId(int num) {
        if (mExternalDisplayList == null || num < 0
                || num >= mExternalDisplayList.size()) {
            return -1;
        }
        return mExternalDisplayList.get(num).getDisplayId();
    }

    public int getExtDisplayCount() {
        if (mExternalDisplayList == null) {
            return -1;
        }
        return mExternalDisplayList.size();
    }
}
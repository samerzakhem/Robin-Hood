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

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Information about the content we want to show in a presentation.
 */
public class PresentationContents implements Parcelable {
    String presentationClassName;
    int displayId;

    public PresentationContents(String presentationClassName, int displayId) {
        this.presentationClassName = presentationClassName;
        this.displayId = displayId;
    }

    private PresentationContents(Parcel in) {
        this.presentationClassName = in.readString();
        this.displayId = in.readInt();
    }

    public static final Creator<PresentationContents> CREATOR = new Creator<PresentationContents>() {
        @Override
        public PresentationContents createFromParcel(Parcel in) {
            return new PresentationContents(in);
        }

        @Override
        public PresentationContents[] newArray(int size) {
            return new PresentationContents[size];
        }
    };

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(presentationClassName);
        dest.writeInt(displayId);
    }
}

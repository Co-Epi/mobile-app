package com.coepi.react;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ReactBridgeModule extends ReactContextBaseJavaModule {
    public ReactBridgeModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ReactBridge";
    }

    @ReactMethod
    public void add(int a, int b, Promise promise) {
        promise.resolve(a + b);
    }
}

package com.phong_xa_2.modules;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.phong_xa_2.widgets.ProgressDialog;

public class CBNativeModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public CBNativeModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "CBNative";
  }

  @ReactMethod
  public void showLoading() {
    ProgressDialog.showLoading(getCurrentActivity());
  }

  @ReactMethod
  public void hideLoading() {
    ProgressDialog.hideLoading(getCurrentActivity());
  }

  @ReactMethod
  public void exitApp() {
    System.exit(0);
  }
}

import {NativeModules} from 'react-native';

export const CBNativeModule = NativeModules.CBNative;

export default class CBNative {
  static show() {
    CBNativeModule.showLoading();
  }

  static hide() {
    CBNativeModule.hideLoading();
  }
}

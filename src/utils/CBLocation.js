import {NativeModules, NativeEventEmitter, Platform} from 'react-native';

const CBLocationModule = NativeModules.CBLocation;
const CBLocationEmitter = new NativeEventEmitter(CBLocationModule);
import {openSettings} from 'react-native-permissions';

export default class CBLocation {
  static async getCurrentLocation() {
    return CBLocationModule.getCurrentLocation();
  }

  static startUpdatingLocation() {
    CBLocationModule.startUpdatingLocation();
  }

  static stopUpdatingLocation() {
    CBLocationModule.stopUpdatingLocation();
  }

  static openLocationSettings() {
    CBLocationModule.openLocationSettings();
  }

  static openAppPermissions() {
    if (Platform.OS === 'android') {
      CBLocationModule.openAppPermissions();
    } else {
      openSettings();
    }
  }

  static onLocationChange(callback) {
    return CBLocationEmitter.addListener('CBLocationChange', callback);
  }
}

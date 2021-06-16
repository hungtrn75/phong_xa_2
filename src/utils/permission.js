import {Alert} from 'react-native';
import {
  checkMultiple,
  openSettings,
  PERMISSIONS,
  requestMultiple,
} from 'react-native-permissions';

export const requestLocationPermisstionsAndroid = async () => {
  await requestMultiple([
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  ]);

  const statuses = await checkMultiple([
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  ]);
  let valid = true;
  Object.entries(statuses).map(([key, val]) => {
    if (val === 'blocked') {
      valid = false;
      return;
    }
  });
  if (!valid) {
    Alert.alert(
      'Bạn đã từ chối quyền vị trí ứng dụng',
      'Để ứng dụng hoạt động ổn định, vui lòng cho phép quyền cho ứng dụng',
      [
        {
          text: 'Bỏ qua',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Mở cài đặt', onPress: openSettings},
      ],
    );
  }

  return valid;
};

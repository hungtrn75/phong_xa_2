import React from 'react';
import {Alert, Linking, Platform, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CBLocation from '../../../utils/CBLocation';
import {requestLocationPermisstionsAndroid} from '../../../utils/permission';
import {moderateScale} from '../../../utils/size_matter';
import Block from '../../../widgets/base/block';
import SizedBox from '../../../widgets/base/sized_box';
import styles from '../map.styles';

const LeftTools = ({spaceRef, camera, map, location}) => {
  const onChangeZoom = type => async () => {
    if (map.current) {
      const zoom = await map.current.getZoom();
      if (type) {
        camera.current.zoomTo(zoom - 1, 100);
      } else {
        camera.current.zoomTo(zoom + 1, 100);
      }
    }
  };

  const navigateHome = () => {
    if (camera.current) {
      camera.current.setCamera(initCamera);
    }
  };

  const navigateCurrentLocation = async () => {
    const valid = await requestLocationPermisstionsAndroid();
    if (valid) {
      try {
        const location = await CBLocation.getCurrentLocation();
        if (location) {
          const {
            coords: {longitude, latitude},
          } = location;
          camera.current?.setCamera({
            centerCoordinate: [longitude, latitude],
            zoomLevel: 16,
          });
        }
      } catch (error) {
        switch (error.code) {
          case 'E_NO_PROVIDER_ENABLE':
            Alert.alert(
              'Bạn đã tắt định vị cho thiết bị di động',
              'Để tiếp tục vui lòng mở cài đặt để thay đổi!',
              [
                {
                  text: 'Không, Cảm ơn',
                  style: 'cancel',
                },
                {
                  text: 'Mở cài đặt',
                  onPress: CBLocation.openLocationSettings,
                },
              ],
            );
            break;
          case 'E_NO_PERMISSION_GRANDED':
            Alert.alert(
              'Bạn đã từ chối quyền truy cấp vị trí',
              'Để tiếp tục vui lòng cho phép quyền truy cập vị trí cho ứng dụng!',
              [
                {
                  text: 'Không, Cảm ơn',
                  style: 'cancel',
                },
                {
                  text: 'Mở cài đặt',
                  onPress: CBLocation.openAppPermissions,
                },
              ],
            );
            break;
          case 'E_NETWORK_TIMEOUT':
            Alert.alert(
              'Chưa lấy được vị trí',
              `Đợi thêm 1 phút hoặc có thể mở ứng dụng bản đồ ở điện thoại lên để lấy vị trí chính xác`,
              [
                {
                  text: 'Đồng ý',
                },
                {
                  text: 'Mở bản đồ',
                  onPress: () => {
                    const url = Platform.select({
                      ios: 'maps:',
                      android: 'geo:',
                    });
                    Linking.canOpenURL(url).then(supported => {
                      if (supported) {
                        return Linking.openURL(url);
                      } else {
                        const browser_url =
                          'https://www.google.com/maps/@' +
                          latitude +
                          ',' +
                          longitude +
                          '?q=' +
                          label;
                        return Linking.openURL(browser_url);
                      }
                    });
                  },
                  style: 'cancel',
                },
              ],
            );
            break;
          default:
            break;
        }
      }
    }

    // if (camera.current && valid) {
    //   camera.current.setCamera({
    //     centerCoordinate: [
    //       location.current.coords.longitude,
    //       location.current.coords.latitude,
    //     ],
    //     zoomLevel: 16,
    //     animationDuration: 1000,
    //   });
    // }
  };

  return (
    <View
      style={[
        styles.addB,
        {
          left: moderateScale(getSpace(spaceRef.current)) + 20,
        },
      ]}>
      <Block
        onPress={onChangeZoom(0)}
        style={styles.btn}
        //@ts-ignore
        onLongPress={() => {
          Alert.alert('Phóng to');
        }}>
        <Icon name="plus" size={24} />
      </Block>
      <View style={styles.v1} />

      <Block
        onPress={onChangeZoom(1)}
        style={styles.btn} //@ts-ignore
        onLongPress={() => {
          Alert.alert('Thu nhỏ');
        }}>
        <Icon name="minus" size={24} />
      </Block>
      <SizedBox height={15} />
      <Block
        onPress={navigateHome}
        style={styles.btn} //@ts-ignore
        onLongPress={() => {
          Alert.alert('Quay về vị trí ban đầu');
        }}>
        <Icon name="home" size={24} />
      </Block>
      <SizedBox
        height={15} //@ts-ignore
        onLongPress={() => {
          Alert.alert('Vị trí hiện tại của bạn');
        }}
      />
      <Block onPress={navigateCurrentLocation} style={styles.btn}>
        <Icon name="near-me" size={24} />
      </Block>
    </View>
  );
};

export default LeftTools;

export const getSpace = type => {
  switch (type) {
    case null:
      return 0;
    case 'visibleCaculate':
      return 0;
    case 'visibleChuGiai':
      return 450;

    default:
      return 400;
  }
};

const initCamera = {
  centerCoordinate: [106.934828, 16.035012],
  zoomLevel: 5,
  animationDuration: 1000,
};

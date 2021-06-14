import React from 'react';
import {Alert, Linking, View} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
    console.log(camera.current, location.current);

    if (camera.current && location.current) {
      const hasLocationPermission = await hasLocationPermissionIOS();

      if (!hasLocationPermission) {
        return;
      }

      camera.current.setCamera({
        centerCoordinate: [
          location.current.coords.longitude,
          location.current.coords.latitude,
        ],
        zoomLevel: 16,
        animationDuration: 1000,
      });
    }
  };

  const hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(`Turn on Location Services to determine your location.`, '', [
        {text: 'Go to Settings', onPress: openSetting},
        {text: "Don't Use Location", onPress: () => {}},
      ]);
    }

    return false;
  };
  return (
    <View
      style={[
        styles.addB,
        {
          left: getSpace(spaceRef.current) + 20,
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

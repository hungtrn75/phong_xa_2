import MapboxGL from '@react-native-mapbox-gl/maps';
import moment from 'moment';
import React from 'react';
import isEqual from 'react-fast-compare';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../../theme';
import Block from '../../../widgets/base/block';
import styles from '../map.styles';

const configOffline = {
  minZoom: 6.81,
  maxZoom: 14,
};

const initPack = {
  name: '',
  offlineRegion: null,
  offlineRegionStatus: null,
  visible: false,
};

function MapPack({visible, setMapPack, mapPack, getPacks}) {
  const onDownloadPack = async () => {
    if (mapPack.name) {
      const packName = `${mapPack.name.trim()}_${moment().format('DD/MM/YY')}`;
      MapboxGL.offlineManager.createPack(
        {
          ...configOffline,
          name: packName,
          bounds: mapPack.visibleBounds,
          styleURL:
            'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        },
        onDownloadProgress,
        errorListener,
      );
    }
  };
  const onDownloadProgress = (offlineRegion, offlineRegionStatus) => {
    setMapPack({
      ...mapPack,
      name: offlineRegion.name,
      offlineRegion,
      offlineRegionStatus,
    });
    if (offlineRegionStatus?.percentage === 100) {
      getPacks();
      setMapPack({...initPack});
    }
  };

  const errorListener = async (offlineRegion, err) => {
    try {
      onDeletePack(offlineRegion.name)();
      setTimeout(() => setMapPack(initPack), 200);
    } catch (error) {}
  };

  const onDeletePack = packName => async () => {
    try {
      console.log('asd', packName);
      await MapboxGL.offlineManager.deletePack(packName);
      await getPacks();
      setMapPack({
        ...initPack,
      });
    } catch (error) {
      console.log(error);

      setMapPack({
        ...initPack,
      });
    }
  };

  const onCancelDownload = async () => {
    if (mapPack.offlineRegion) {
      await mapPack.offlineRegion.pause();
      onDeletePack(mapPack.offlineRegion.name);
    }
    setMapPack({
      ...initPack,
    });
  };
  if (!visible) return null;
  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.v14,
        {
          left: 420,
        },
      ]}>
      <Block row center space="between" style={styles.p20}>
        <Block>
          <Text style={styles.t6}>Tải map offline</Text>
          <Text style={styles.t5}>Dữ liệu vùng đang hiển thị</Text>
        </Block>
        <TouchableOpacity
          onPress={() => {
            setMapPack({
              ...initPack,
            });
          }}>
          <Icon name="close" size={24} color={Colors.GRAY} />
        </TouchableOpacity>
      </Block>

      <Block style={styles.p20}>
        <Text style={styles.t4}>Nhập tên</Text>
        <TextInput
          value={mapPack.name}
          onChangeText={text =>
            setMapPack({
              ...mapPack,
              name: text,
            })
          }
          style={styles.t3}
        />
      </Block>
      <View style={styles.v12} />
      <Block row style={styles.v11}>
        <Block onPress={onCancelDownload} middle center style={styles.v9}>
          <Text style={styles.norTxtBorder}>Huỷ bỏ</Text>
        </Block>
        <Block
          onPress={onDownloadPack}
          middle
          center
          style={styles.v10}
          disabled={mapPack.offlineRegionStatus ? true : false}>
          <Text style={styles.norWTxt}>
            {mapPack.offlineRegionStatus
              ? `${mapPack.offlineRegionStatus.percentage}%`
              : 'Tải'}
          </Text>
        </Block>
      </Block>
    </View>
  );
}

export default React.memo(MapPack, isEqual);

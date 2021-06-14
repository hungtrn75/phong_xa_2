import MapboxGL from '@react-native-mapbox-gl/maps';
import {area, polygon} from '@turf/turf';
import React from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../../theme';
import Block from '../../../widgets/base/block';
import styles from '../map.styles';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiaHV1bmdoaXBoYW0iLCJhIjoiY2pseXg2ZTl0MXRkdDN2b2J5bzFpbmlhZSJ9.cChkzU6jLVXx4v75qo_dfQ',
);

const OfflinePacks = ({
  show,
  packs,
  mapPack,
  onSelectAction,
  setMapPack,
  map,
  camera,
  initPack,
  getPacks,
}) => {
  const onAddPack = async () => {
    if (!map.current) return;
    const visibleBounds = await map.current.getVisibleBounds();
    const polygonBounds = polygon([
      [
        visibleBounds[0],
        [visibleBounds[1][0], visibleBounds[0][1]],
        visibleBounds[1],
        [visibleBounds[0][0], visibleBounds[1][1]],
        visibleBounds[0],
      ],
    ]);

    const areaPack = area(polygonBounds);

    if (areaPack * 1e-6 < 1000) {
      setMapPack({
        ...mapPack,
        visible: true,
        visibleBounds,
      });
    } else {
      showMessage({
        message:
          'Diện tích vùng cần tải vượt quá 1000 km2. Vui lòng thu nhỏ diện tích để tải',
      });
    }
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

  //Mapbox offline packs
  const renderPack = ({item, index}) => {
    return (
      <Block
        key={'pack' + index}
        row
        center
        style={styles.offline}
        space="between"
        onPress={() => {
          camera.current?.fitBounds(item.pack.bounds[0], item.pack.bounds[1]);
        }}>
        <Text style={styles.p1}>{item._metadata.name}</Text>
        <TouchableOpacity onPress={onDeletePack(item._metadata.name)}>
          <Icon name="delete" size={24} />
        </TouchableOpacity>
      </Block>
    );
  };
  if (!show) return null;
  return (
    <View style={[styles.mapTile]}>
      <View style={[styles.wrapTitle, styles.v8]}>
        <Icon name="cloud-download" size={24} color={Colors.WHITE} />
        <Text style={styles.title}>Dữ liệu bản đồ offline</Text>
        <TouchableOpacity onPress={onSelectAction('mapOfflineShow')}>
          <Icon name="chevron-left" size={28} color={Colors.WHITE} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={packs}
        contentContainerStyle={styles.fl}
        keyExtractor={(item, index) => 'pack' + index}
        renderItem={renderPack}
        ListEmptyComponent={
          <Block center>
            <Text style={styles.nodata}>Chưa có dữ liệu</Text>
          </Block>
        }
      />

      {mapPack.visible ? null : (
        <Block style={styles.v18} onPress={onAddPack}>
          <Text style={styles.t7}>Dữ liệu sẽ được tải theo vùng hiện tại</Text>
          <Icon name="plus-circle" color={Colors.PRIMARY} size={50} />
        </Block>
      )}
    </View>
  );
};

export default OfflinePacks;

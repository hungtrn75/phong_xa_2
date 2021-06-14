import moment from 'moment';
import React from 'react';
import isEqual from 'react-fast-compare';
import {Animated, FlatList, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../../theme';
import colors from '../../../theme/colors';
import Block from '../../../widgets/base/block';
import styles from '../map.styles';

function DuLieuOffline({
  onSelectAction,
  syncOffline,
  offlineData,
  camera,
  visible,
  deleteDraft,
}) {
  const xoaOfflineItem = id => async () => {
    await deleteDraft(id);
  };
  //offline data
  const renderOfflineItem = ({item, index}) => {
    const {
      geometry: {type, coordinates},
      values,
    } = item.json;

    return (
      <Block
        key={'pack' + item.id}
        style={styles.feaItem}
        row
        space="between"
        center
        onPress={() => {
          if (type === 'Point') {
            camera?.current?.setCamera({
              centerCoordinate: coordinates,
              zoomLevel: 16,
              animationDuration: 1000,
            });
          } else {
            camera?.current?.setCamera({
              centerCoordinate: coordinates[0],
              zoomLevel: 16,
              animationDuration: 1000,
            });
          }
        }}>
        <Block flex={1}>
          <Text
            style={
              styles.f16
            }>{`Số người bị lây nhiễm: ${values.number_people_infected}`}</Text>
          <Text
            style={
              styles.f16
            }>{`Số người bị nhiễm: ${values.number_people_bleached}`}</Text>
          <Text
            style={
              styles.f16
            }>{`Số nhà bị ảnh hưởng: ${values.number_house_affected}`}</Text>
          <Text
            style={
              styles.f16
            }>{`Số nhà bị nhiễm: ${values.number_house_bleached}`}</Text>
          {values.region_bleached ? (
            <Text
              style={
                styles.f16
              }>{`Khu vực ảnh hưởng: ${values.region_bleached}`}</Text>
          ) : null}
          <Text style={styles.feaSub}>
            {moment(values.created_at).format('DD/MM/YYYY HH:mm')}
          </Text>
        </Block>

        <TouchableOpacity onPress={xoaOfflineItem(item.id)}>
          <Icon name="delete" size={22} color={Colors.BORDER} />
        </TouchableOpacity>
      </Block>
    );
  };

  if (!visible) return null;
  return (
    <Animated.View style={[styles.mapTile]}>
      <View style={[styles.wrapTitle, styles.v8]}>
        <Icon name="format-list-text" size={24} color={Colors.WHITE} />
        <Text style={styles.title}>Dữ liệu offline</Text>
        <TouchableOpacity onPress={onSelectAction('offlineFeature')}>
          <Icon name="chevron-left" size={28} color={colors.WHITE} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={offlineData}
        contentContainerStyle={styles.fl}
        keyExtractor={(item, index) => 'title' + index}
        renderItem={renderOfflineItem}
        ListEmptyComponent={
          <Block center>
            <Text style={styles.nodata}>Chưa có dữ liệu offline</Text>
          </Block>
        }
      />
      <Block style={styles.v18} onPress={syncOffline}>
        <Text style={styles.t7}>Đồng bộ dữ liệu lên hệ thống</Text>
        <Icon name="sync" color={Colors.PRIMARY} size={40} />
      </Block>
    </Animated.View>
  );
}

export default React.memo(DuLieuOffline, isEqual);

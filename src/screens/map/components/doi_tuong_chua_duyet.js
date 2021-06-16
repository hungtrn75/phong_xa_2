import moment from 'moment';
import React, {useCallback} from 'react';
import isEqual from 'react-fast-compare';
import {Alert, FlatList, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../../theme';
import colors from '../../../theme/colors';
import Block from '../../../widgets/base/block';
import SizedBox from '../../../widgets/base/sized_box';
import styles from '../map.styles';

const DoiTuongChuaDuyet = ({
  visible = false,
  onSelectAction,
  pendingFeatures,
  chinhSuaLop,
  navigateToPending,
  deleteLayer,
}) => {
  //RENDER ITEMS
  //Chờ duyệt layers
  const onDelete = useCallback(
    id => () => {
      Alert.alert(
        'Xoá thông tin thực địa',
        'Dữ liệu sau khi xoá sẽ không được khôi phục.Bạn có chắc chắn muốn xoá hay không?',
        [
          {
            text: 'Lần sau',
          },
          {
            text: 'Xoá',
            onPress: () => deleteLayer(id),
          },
        ],
      );
    },
    [deleteLayer],
  );
  const renderPendingFeatureItem = ({item, index}) => {
    return (
      <Block
        key={'pack' + index}
        style={styles.feaItem}
        onPress={navigateToPending({
          center_point: {
            coordinates:
              item.geometry.type == 'Point'
                ? item.geometry.coordinates
                : item.geometry.coordinates[0][1],
          },
        })}>
        {item.region_bleached ? (
          <Text
            style={
              styles.f16
            }>{`Khu vực ảnh hưởng: ${item.region_bleached}`}</Text>
        ) : null}
        <Text
          style={
            styles.f16
          }>{`Số người bị lây nhiễm: ${item.number_people_infected}`}</Text>
        <Text
          style={
            styles.f16
          }>{`Số người bị nhiễm: ${item.number_people_bleached}`}</Text>
        <Text
          style={
            styles.f16
          }>{`Số nhà bị ảnh hưởng: ${item.number_house_affected}`}</Text>
        <Text
          style={
            styles.f16
          }>{`Số nhà bị nhiễm: ${item.number_house_bleached}`}</Text>

        <Block row center space="between">
          <Text style={styles.feaSub}>
            {moment(item.created_at).format('DD/MM/YYYY HH:mm')}
          </Text>
          <View style={{flex: 1}} />
          <TouchableOpacity onPress={chinhSuaLop(item)}>
            <Icon name="pencil" size={22} color={'orange'} />
          </TouchableOpacity>
          <SizedBox width={15} />
          <TouchableOpacity onPress={onDelete(item.id)}>
            <Icon name="delete" size={22} color={'red'} />
          </TouchableOpacity>
        </Block>
      </Block>
    );
  };
  if (!visible) return null;
  return (
    <View style={[styles.mapTile]}>
      <View style={[styles.wrapTitle, styles.v8]}>
        <Icon name="format-list-text" size={24} color={Colors.WHITE} />
        <Text style={styles.title}>Thông Tin Thực Địa</Text>
        <TouchableOpacity onPress={onSelectAction('pendingFeatureShow')}>
          <Icon name="chevron-left" size={28} color={colors.WHITE} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={pendingFeatures}
        contentContainerStyle={styles.fl}
        keyExtractor={(item, index) => 'title' + index}
        renderItem={renderPendingFeatureItem}
        ListEmptyComponent={
          <Block center>
            <Text style={styles.nodata}>Chưa có dữ liệu</Text>
          </Block>
        }
      />
    </View>
  );
};

export default React.memo(DoiTuongChuaDuyet, isEqual);

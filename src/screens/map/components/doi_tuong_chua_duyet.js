import moment from 'moment';
import React from 'react';
import isEqual from 'react-fast-compare';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
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
        {item.region_bleached ? (
          <Text
            style={
              styles.f16
            }>{`Khu vực ảnh hưởng: ${item.region_bleached}`}</Text>
        ) : null}
        <Block row center space="between">
          <Text style={styles.feaSub}>
            {moment(item.created_at).format('DD/MM/YYYY HH:mm')}
          </Text>
          <View style={{flex: 1}} />
          <TouchableOpacity onPress={() => {}}>
            <Icon name="pencil" size={22} color={Colors.BORDER} />
          </TouchableOpacity>
          <SizedBox width={15} />
          <TouchableOpacity onPress={() => deleteLayer(item.id)}>
            <Icon name="delete" size={22} color={Colors.BORDER} />
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
        <Text style={styles.title}>Đối tượng chưa duyệt</Text>
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

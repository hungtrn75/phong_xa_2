import React from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RELEASE_ENDPOINT} from '../../../constants';
import colors from '../../../theme/colors';
import Block from '../../../widgets/base/block';
import styles from '../map.styles';

const ChuGiai = ({visible = false, chuGiais, onSelectAction}) => {
  const renderChuGiaiItem = ({item, index}) => {
    const backgroundColor = item.color;
    return (
      <View
        key={'cg' + index}
        style={{marginVertical: 2.5, paddingRight: 20, paddingLeft: 10}}>
        <Text style={styles.cg1}>{item.name}</Text>
        {item.icon ? (
          <Image
            source={{uri: `${RELEASE_ENDPOINT}${item.icon}`}}
            resizeMode="contain"
            style={styles.cg2}
          />
        ) : null}
        {item.shape_type === 'AREA' && item.color && item.opacity ? (
          <View style={[styles.cg3, {backgroundColor}]} />
        ) : null}
        {item.shape_type === 'POINT' && item.color && item.opacity ? (
          <View style={[styles.cg4, {backgroundColor}]} />
        ) : null}
        {item.children?.length
          ? item.children.map((el, index) => (
              <Block row center key={'cgc' + index} style={styles.cg5}>
                {el.shape_type === 'AREA' && el.color && el.opacity ? (
                  <View style={[styles.cg6, {backgroundColor: el.color}]} />
                ) : null}
                {el.shape_type === 'POINT' && el.color && el.opacity ? (
                  <View style={[styles.cg7, {backgroundColor: el.color}]} />
                ) : null}
                <Text style={styles.cg8}>{el.name}</Text>
              </Block>
            ))
          : null}
      </View>
    );
  };
  if (!visible) return null;
  return (
    <View
      style={[
        styles.mapTile,
        {
          width: 450,
        },
      ]}>
      <View style={[styles.wrapTitle, styles.v8]}>
        <Icon name="format-list-bulleted-type" size={24} color={colors.WHITE} />
        <Text style={styles.title}>Chú giải</Text>
        <TouchableOpacity onPress={onSelectAction('visibleChuGiai')}>
          <Icon name="chevron-left" size={28} color={colors.WHITE} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={chuGiais}
        contentContainerStyle={styles.fl}
        keyExtractor={(item, index) => 'title' + index}
        renderItem={renderChuGiaiItem}
        ListEmptyComponent={
          <Block center>
            <Text style={styles.nodata}>Chưa có dữ liệu</Text>
          </Block>
        }
      />
    </View>
  );
};

export default ChuGiai;

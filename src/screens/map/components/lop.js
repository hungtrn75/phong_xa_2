import CheckBox from '@react-native-community/checkbox';
import React from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../../theme';
import Block from '../../../widgets/base/block';
import styles from '../map.styles';

const Lop = function ({
  visible,
  setWhiteList,
  setPrevObjects,
  layers,
  prevObjects,
  onSelectAction,
  toggleLop,
  toggle,
}) {
  //Lớp
  const renderObjectItem = ({item, index}) => {
    return (
      <Block
        row
        onPress={toggleLop({item, index})}
        key={'layer' + index}
        style={[styles.lop1]}
        center>
        <CheckBox
          value={item.checked}
          onCheckColor={Colors.PRIMARY}
          onTintColor={Colors.PRIMARY}
          disabled={true}
          animationDuration={0}
          style={styles.lop3}
        />
        <Text style={styles.lop2}>{item.name}</Text>
      </Block>
    );
  };
  if (!visible) return null;
  return (
    <View style={[styles.mapTile]}>
      <View style={[styles.wrapTitle, styles.v8]}>
        <TouchableOpacity
          onPress={() => {
            let newObj = [];
            if (toggle.current) {
              setWhiteList(layers.map(el => el.id));

              newObj = prevObjects.map(el => ({
                ...el,
                checked: true,
              }));
            } else {
              setWhiteList([]);
              newObj = prevObjects.map(el => ({
                ...el,
                checked: false,
              }));
            }
            toggle = !toggle;
            setPrevObjects(newObj);
          }}>
          <Icon name="layers" size={24} color={Colors.WHITE} />
        </TouchableOpacity>
        <Text style={styles.title}>Lớp</Text>
        <TouchableOpacity onPress={onSelectAction('objectShow')}>
          <Icon name="chevron-left" size={28} color={Colors.WHITE} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={prevObjects}
        contentContainerStyle={styles.fl}
        keyExtractor={(item, index) => 'layer' + index}
        renderItem={renderObjectItem}
        ListEmptyComponent={
          <Block center>
            <Text style={styles.nodata}>Chưa có dữ liệu</Text>
          </Block>
        }
      />
    </View>
  );
};

export default Lop;

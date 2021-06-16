import CheckBox from '@react-native-community/checkbox';
import React from 'react';
import isEqual from 'react-fast-compare';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../../constants';
import {Colors} from '../../../theme';
import colors from '../../../theme/colors';
import Block from '../../../widgets/base/block';
import SizedBox from '../../../widgets/base/sized_box';
import styles from '../map.styles';

const ThemMoiDoiTuong = ({
  visible = false,
  visible2,
  setVisible2,
  mode,
  setMode,
  onXoaHanhDongThemMoi,
  forms,
  value,
  spaceRef,
  lopDoiTuong,
  setLopDoituong,
  setLayer,
  setVisible,
  setAnnitation,
  initLayer,
  initVisible,
  onSaveLayer,
}) => {
  //Bieu Mau
  const renderBieuMau = ({item, index}) => {
    return (
      <Block
        row
        onPress={() => {
          setLopDoituong([item]);
          if (item.layer.shape_type === 'POLYGONE') {
            setMode('polygon');
            setAnnitation({
              coordinates: [],
              activeIndex: null,
            });
            if (mode) setLayer({...initLayer});
          }
          if (item.layer.shape_type === 'POINT') {
            setMode('point');
            setAnnitation({
              coordinates: [],
              activeIndex: null,
            });
            if (mode) setLayer({...initLayer});
          }
          value.current = 0;
        }}
        key={'layer' + index}
        style={[styles.lop1, {}]}
        center>
        <CheckBox
          value={lopDoiTuong.length && item.id === lopDoiTuong[0].id}
          onCheckColor={Colors.PRIMARY}
          onTintColor={Colors.PRIMARY}
          disabled={true}
          animationDuration={0}
          style={styles.lop3}
        />
        <Text
          style={[
            styles.lop2,
            {
              color:
                lopDoiTuong.length && item.id === lopDoiTuong[0].id
                  ? Colors.PRIMARY
                  : 'black',
            },
          ]}>
          {item.name}
        </Text>
        <View style={{flex: 1}} />
        <Icon
          name={
            item.layer.shape_type === 'POLYGONE'
              ? 'shape-polygon-plus'
              : 'circle-medium'
          }
          size={24}
        />
      </Block>
    );
  };
  if (!visible) return null;
  return (
    <View pointerEvents="box-none" style={styles.themMoi}>
      <View
        style={{
          width: SCREEN_WIDTH * 0.45,
          borderRadius: 4,
        }}>
        <View style={styles.boxThemMoi}>
          <Text
            style={[
              styles.t1,
              {
                color: 'white',
              },
            ]}>
            Thông tin thiệt hại
          </Text>
          <Block row center>
            <TouchableOpacity
              onPress={() =>
                setVisible2({
                  ...visible2,
                  thuNho: true,
                  themMoi: false,
                })
              }>
              <Icon name="chevron-down" size={32} color={colors.WHITE} />
            </TouchableOpacity>
            <SizedBox width={10} />
            <TouchableOpacity onPress={onXoaHanhDongThemMoi}>
              <Icon name="close" size={24} color={colors.WHITE} />
            </TouchableOpacity>
          </Block>
        </View>
        <View style={styles.tmBg}>
          <Text style={styles.tmTxt}>
            Chọn khu vực ảnh hưởng <Text style={styles.tmReq}>(*)</Text>
          </Text>
          <Block style={{maxHeight: SCREEN_HEIGHT * 0.5}}>
            <FlatList
              data={forms}
              keyExtractor={(item, index) => 'bm' + index}
              renderItem={renderBieuMau}
              ListEmptyComponent={
                <Block center>
                  <Text style={styles.nodata}>Chưa có dữ liệu</Text>
                </Block>
              }
            />
          </Block>

          <Block row space="around" style={{paddingVertical: 10}}>
            {visible2.ve ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    value.current = 0;
                    const newLayer = {
                      type: 'FeatureCollection',
                      features: [
                        {
                          type: 'Feature',
                          properties: {},
                          geometry: {
                            type: 'LineString',
                            coordinates: [
                              [0, 0],
                              [0, 0],
                            ],
                          },
                          numberZero: 2,
                        },
                      ],
                    };

                    setAnnitation({
                      activeIndex: null,
                      coordinates: [],
                    });
                    if (mode) setLayer(newLayer);
                    setVisible2({
                      themMoi: false,
                      ve: true,
                      thuNho: true,
                    });
                  }}>
                  <Text style={styles.tmBtnD}>
                    {'Xác định lại\nkhu vực ảnh hưởng'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onSaveLayer}>
                  <Text style={styles.tmBtnA}>
                    {'Nhập các\nthông tin khác'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (lopDoiTuong.length) {
                    if (lopDoiTuong[0].layer.shape_type === 'AREA') {
                      setMode('polygon');
                      if (mode) setLayer(initLayer);
                    }
                    if (lopDoiTuong[0].layer.shape_type === 'POINT') {
                      setMode('point');
                      if (mode) setLayer(initLayer);
                    }
                  } else {
                    return showMessage({
                      message: 'Bạn chưa chọn lớp đối tượng',
                      type: 'danger',
                    });
                  }
                  spaceRef.current = null;
                  value.current = 0;
                  setVisible({
                    ...initVisible,
                  });

                  setVisible2({
                    themMoi: false,
                    ve: true,
                    thuNho: true,
                  });
                }}>
                <Text style={styles.tmBtnA}>
                  Xác định thuộc tính không gian
                </Text>
              </TouchableOpacity>
            )}
          </Block>
        </View>
      </View>
    </View>
  );
};

export default React.memo(ThemMoiDoiTuong, isEqual);

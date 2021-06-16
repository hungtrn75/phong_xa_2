import React from 'react';
import isEqual from 'react-fast-compare';
import {StyleSheet, Text, Image, Platform} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {STATUSBAR_HEIGHT} from '../../../constants';
import {navigate} from '../../../navigator/helper';
import {me} from '../../../service/auth';
import {ShareStyles} from '../../../theme';
import {isValidCoordinate} from '../../../utils/helper';
import {moderateScale} from '../../../utils/size_matter';
import Block from '../../../widgets/base/block';
import {getSpace} from './left_tools';

const ViTri = ({
  loc,
  setLoc,
  camera,
  showLocation,
  setshowPosition,
  spaceRef,
  memoPx,
}) => {
  const navigate1 = () => {
    if (isValidCoordinate(+loc.lon, +loc.lat)) {
      setshowPosition(true);
      camera?.current.setCamera({
        centerCoordinate: [+loc.lon, +loc.lat],
        zoomLevel: 16,
        animationDuration: 1000,
      });
    }
  };

  const onPress = () => {
    navigate('ADD_PLACE', {
      formValues: {
        edit: memoPx.current ? {item: memoPx.current} : null,
        type: 3,
        geometry: {
          type: 'Point',
          coordinates: [+loc.lon, +loc.lat],
        },
      },
    });
  };
  return (
    <Block
      row
      center
      style={[
        styles.b1,
        {left: moderateScale(getSpace(spaceRef.current)) + 90},
      ]}>
      <Block style={styles.b2} row center>
        <Block row flex={1} center>
          <Text style={styles.label}>Lat:</Text>
          <TextInput
            placeholder="Vĩ độ"
            style={styles.text}
            value={loc.lat}
            keyboardType="numeric"
            onChangeText={txt => {
              if (showLocation) {
                setshowPosition(false);
              }
              setLoc({...loc, lat: txt});
            }}
          />
        </Block>
        <Block row flex={1.15} center>
          <Text style={styles.label}>Lon:</Text>
          <TextInput
            placeholder="Kinh độ"
            style={styles.text}
            keyboardType="numeric"
            value={loc.lon}
            onChangeText={txt => {
              if (showLocation) {
                setshowPosition(false);
              }
              setLoc({...loc, lon: txt});
            }}
          />
        </Block>
        <TouchableOpacity onPress={navigate1}>
          <Icon name="map-marker-radius" size={24} />
        </TouchableOpacity>
      </Block>
      {loc.lat && loc.lon ? (
        <TouchableOpacity style={styles.t1} onPress={onPress}>
          <Image
            style={styles.i1}
            source={require('../../../assets/images/radiation.png')}
          />
        </TouchableOpacity>
      ) : null}
    </Block>
  );
};

export default ViTri;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    marginRight: 20,
    padding: 0,
  },
  label: {
    fontSize: 16,
  },
  b1: {
    position: 'absolute',
    top:
      Platform.select({
        ios: STATUSBAR_HEIGHT,
        android: 0,
      }) + 10,
  },
  b2: {
    width: 330,
    backgroundColor: 'white',
    height: 40,
    ...ShareStyles.shadow,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  t1: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  i1: {
    width: 20,
    height: 20,
  },
});

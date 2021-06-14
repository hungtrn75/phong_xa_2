import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {STATUSBAR_HEIGHT} from '../../../constants';
import {ShareStyles} from '../../../theme';
import {isValidCoordinate} from '../../../utils/helper';
import Block from '../../../widgets/base/block';
import {getSpace} from './left_tools';

const ViTri = ({
  loc,
  setLoc,
  camera,
  showLocation,
  setshowPosition,
  spaceRef,
}) => {
  const navigate = () => {
    if (isValidCoordinate(+loc.lon, +loc.lat)) {
      setshowPosition(true);
      camera?.current.setCamera({
        centerCoordinate: [+loc.lon, +loc.lat],
        zoomLevel: 16,
        animationDuration: 1000,
      });
    }
  };
  return (
    <Block
      style={{
        width: 330,
        position: 'absolute',
        top: STATUSBAR_HEIGHT + 10,
        left: getSpace(spaceRef.current) + 90,

        backgroundColor: 'white',
        height: 40,
        ...ShareStyles.shadow,
        borderRadius: 8,
        paddingHorizontal: 10,
      }}
      row
      center>
      <Block row flex={1} center>
        <Text style={styles.label}>Lat:</Text>
        <TextInput
          placeholder="Kinh độ"
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
          placeholder="Vĩ độ"
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
      <TouchableOpacity onPress={navigate}>
        <Icon name="map-marker-radius" size={24} />
      </TouchableOpacity>
    </Block>
  );
};

export default ViTri;

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    marginRight: 20,
  },
  label: {
    fontSize: 18,
  },
});

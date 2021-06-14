import React from 'react';
import {StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {Colors} from '../../theme';
import Block from '../../widgets/base/block';
import IconButton from '../../widgets/base/icon_button';
import Viewer from '../../widgets/base/image_viewer';

const ImageViewer = ({navigation, route}) => {
  return (
    <Block flex={1}>
      <Viewer source={route.params.source} />
      <IconButton
        icon={<Feather name="x" size={30} color={Colors.WHITE} />}
        style={styles.btnClose}
        onPress={navigation.goBack}
      />
    </Block>
  );
};

export default ImageViewer;

const styles = StyleSheet.create({
  btnClose: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
});

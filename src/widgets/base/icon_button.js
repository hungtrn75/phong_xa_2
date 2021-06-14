import React from 'react';
import {StyleSheet, View} from 'react-native';
import {BorderlessButton} from 'react-native-gesture-handler';

const IconButton = ({icon, style, onPress}) => {
  return (
    <BorderlessButton style={style} onPress={onPress}>
      <View
        style={{
          padding: 5,
        }}>
        {typeof icon === 'function' ? icon() : icon}
      </View>
    </BorderlessButton>
  );
};

export default IconButton;

const styles = StyleSheet.create({});

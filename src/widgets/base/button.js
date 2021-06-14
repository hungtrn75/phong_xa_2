import React from 'react';
import isEqual from 'react-fast-compare';
import {Button as RNativeButton, StyleSheet, View} from 'react-native';
import {BaseButton} from 'react-native-gesture-handler';
import {Colors} from '../../theme';
import Text from './text';

const RNButton = ({color, title, width, onPress}) => {
  return (
    <View style={[styles.button, width && {width}]}>
      <RNativeButton title={title} onPress={onPress} color={color} />
    </View>
  );
};

const Ripple = ({
  color,
  textColor,
  title,
  width,
  onPress,
  textStyle,
  containerStyle,
}) => {
  const wrap = [
    styles.btn,
    color && {
      backgroundColor: color,
    },
    containerStyle,
  ];
  const wrapTextStyles = [textStyle, styles.txt];
  return (
    <BaseButton rippleColor={Colors.RIPPLE} style={wrap} onPress={onPress}>
      <Text
        button
        color={textColor ? textColor : Colors.WHITE}
        style={wrapTextStyles}>
        {title}
      </Text>
    </BaseButton>
  );
};

const Button = {
  RN: React.memo(RNButton, isEqual),
  Ripple: React.memo(Ripple, isEqual),
};

export default Button;

const styles = StyleSheet.create({
  button: {
    width: '100%',
  },
  btn: {
    height: 45,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 4,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontSize: 14,
    letterSpacing: 1.1,
    fontWeight: '600',
  },
});

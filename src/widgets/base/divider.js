import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Colors} from '../../theme';

const Divider = props => {
  const {color, style, ...rest} = props;
  const dividerStyles = [
    styles.divider,
    color && {
      borderBottomColor: color,
    },
  ];
  return <View {...rest} style={dividerStyles} />;
};

export default Divider;

const styles = StyleSheet.create({
  divider: {
    height: 0,
    marginVertical: 10,
    borderBottomColor: Colors.GRAY,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

import React from 'react';
import isEqual from 'react-fast-compare';
import {StyleSheet, View} from 'react-native';

const SizedBox = ({width, height}) => {
  return (
    <View
      style={{
        width: width ? width : 0,
        height: height ? height : 0,
      }}
    />
  );
};

export default React.memo(SizedBox, isEqual);

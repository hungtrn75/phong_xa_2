import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../theme';
import Block from './block';

const Badge = ({
  backgroundColor,
  children,
  containerStyle,
  count,
  overflowCount = 999,
  style,
  showZero = false,
}) => {
  const [badge, setSizeView] = React.useState({
    width: 0,
    height: 0,
    measured: false,
  });

  const _onLayout = e => {
    if (!badge.measured)
      setSizeView({
        height: e.nativeEvent.layout.height,
        width: e.nativeEvent.layout.width,
        measured: true,
      });
  };

  return (
    <View style={containerStyle}>
      {children}
      <Block
        style={[
          styles.badge,
          {
            top: -badge.height / 2,
            right: -badge.width / 2,
            opacity: badge.measured ? 1 : 0,
          },
          backgroundColor && {backgroundColor},
        ]}
        onLayout={_onLayout}>
        <Text
          style={[
            {
              color: Colors.WHITE,
            },
            style,
          ]}>
          {count > overflowCount ? `${overflowCount}+` : count}
        </Text>
      </Block>
    </View>
  );
};

export default Badge;

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    backgroundColor: Colors.ERROR,
    paddingVertical: 2,
    borderRadius: 99,
    paddingHorizontal: 5,
  },
});

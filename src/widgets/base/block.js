import React, {useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {BaseButton} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {Colors, ShareStyles} from '../../theme';

const Block = props => {
  const {
    animated,
    children,
    center,
    disabled,
    flex,
    middle,
    margin,
    onPress,
    padding,
    wrap,
    shadow,
    style,
    space,
    row,
    ripple,
    ...rest
  } = props;

  const getMargins = useMemo(() => {
    if (typeof margin === 'number') {
      return {
        margin,
      };
    }

    if (typeof margin === 'object') {
      const marginSize = Object.keys(margin).length;
      switch (marginSize) {
        case 1:
          return {
            margin: margin[0],
          };
        case 2:
          return {
            marginVertical: margin[0],
            marginHorizontial: margin[1],
          };
        case 3:
          return {
            marginTop: margin[0],
            marginBottom: margin[2],
            marginHorizontial: margin[1],
          };
        default:
          return {
            marginTop: margin[0],
            marginRight: margin[1],
            marginBottom: margin[2],
            marginLeft: margin[3],
          };
      }
    }
  }, [margin]);
  const getPaddings = useMemo(() => {
    if (typeof padding === 'number') {
      return {
        padding,
      };
    }

    if (typeof padding === 'object') {
      const paddingSize = Object.keys(padding).length;
      switch (paddingSize) {
        case 1:
          return {
            padding: padding[0],
          };
        case 2:
          return {
            paddingVertical: padding[0],
            paddingHorizontial: padding[1],
          };
        case 3:
          return {
            paddingTop: padding[0],
            paddingBottom: padding[2],
            paddingHorizontial: padding[1],
          };
        default:
          return {
            paddingTop: padding[0],
            paddingRight: padding[1],
            paddingBottom: padding[2],
            paddingLeft: padding[3],
          };
      }
    }

    return {};
  }, [padding]);

  const blocStyles = [
    styles.block,
    center && styles.center,
    flex && {flex},
    middle && styles.middle,
    getMargins && getMargins,
    padding && getPaddings,
    wrap && {flexWrap: 'wrap'},
    shadow && [ShareStyles.shadow, {backgroundColor: Colors.WHITE}],
    space && {justifyContent: `space-${space}`},
    row && styles.row,
    style && style,
  ];

  if (animated) {
    if (onPress)
      return (
        <TouchableOpacity onPress={onPress}>
          <Animated.View {...rest} style={blocStyles}>
            {children}
          </Animated.View>
        </TouchableOpacity>
      );
    return (
      <Animated.View {...rest} style={blocStyles}>
        {children}
      </Animated.View>
    );
  }

  if (onPress) {
    if (ripple)
      return (
        <BaseButton {...rest} style={blocStyles} onPress={onPress}>
          {children}
        </BaseButton>
      );
    return (
      <TouchableOpacity {...rest} style={blocStyles} onPress={onPress}>
        {children}
      </TouchableOpacity>
    );
  }
  return (
    <View {...rest} style={blocStyles}>
      {children}
    </View>
  );
};

export default Block;

const styles = StyleSheet.create({
  block: {
    display: 'flex',
  },
  row: {
    flexDirection: 'row',
  },
  center: {
    alignItems: 'center',
  },
  middle: {
    justifyContent: 'center',
  },
});

import color from 'color';
import React from 'react';
import isEqual from 'react-fast-compare';
import {StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';
import {useTimingTransition} from 'react-native-redash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../theme';
import {MaterialColors} from '../../theme/colors';
import Block from './block';

const Fab = React.memo(
  ({
    visible = true,
    backgroundColor = Colors.PRIMARY,
    customColor,
    disabled,
    icon,
    small,
    style,
    onPress,
  }) => {
    const transition = useTimingTransition(visible);
    const scale = Animated.interpolate(transition, {
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: Animated.Extrapolate.CLAMP,
    });
    const fabStyles = [
      styles.standard,
      small && styles.small,
      {
        backgroundColor: disabled
          ? MaterialColors.grey.val(300)
          : backgroundColor,
        transform: [
          {
            scale,
          },
        ],
      },
      disabled && styles.disabled,
      style,
    ];
    let foregroundColor = customColor
      ? customColor
      : !color(backgroundColor).isLight()
      ? MaterialColors.white
      : 'rgba(0, 0, 0, .54)';

    if (disabled)
      return (
        <Block animated style={fabStyles} middle center ripple>
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color={foregroundColor}
          />
        </Block>
      );

    return (
      <Block
        animated
        style={fabStyles}
        disabled
        onPress={onPress}
        middle
        center
        ripple>
        <MaterialCommunityIcons name={icon} size={24} color={foregroundColor} />
      </Block>
    );
  },
);

export default React.memo(Fab, isEqual);

const styles = StyleSheet.create({
  standard: {
    height: 56,
    width: 56,
    borderRadius: 28,
    elevation: 6,
  },
  small: {
    height: 40,
    width: 40,
  },
  disabled: {
    elevation: 0,
  },
});

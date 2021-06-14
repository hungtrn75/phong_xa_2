import color from 'color';
import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import {Colors} from '../../theme';
import Block from './block';
import Text from './text';

const Chip = ({
  children,
  disabled,
  mode,
  selected,
  onClose,
  onPress,
  selectedColor,
}) => {
  const isFlat = mode === 'flat';
  const backgroundColor = isFlat
    ? color(selectedColor)
        .alpha(selected ? 0.2 : 0.09)
        .rgb()
        .string()
    : Colors.WHITE;
  const borderColor = isFlat
    ? backgroundColor
    : color(selectedColor).alpha(0.25).rgb().string();

  const textColor = disabled
    ? Colors.GRAY2
    : color(selectedColor).alpha(0.87).rgb().string();

  const chipStyles = [
    styles.container,
    {
      backgroundColor,
      borderColor,
    },
  ];

  const textStyles = [
    {
      color: textColor,
    },
  ];

  return (
    <Block style={chipStyles} row center onPress={onPress}>
      <Text style={textStyles}>{children}</Text>
      {onClose ? (
        <TouchableWithoutFeedback onPress={onClose}>
          <Feather
            name="x-circle"
            size={16}
            style={styles.icon}
            color={textColor}
          />
        </TouchableWithoutFeedback>
      ) : null}
    </Block>
  );
};

Chip.defaultProps = {
  mode: 'flat',
  selectedColor: 'black',
};

export default Chip;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 2.5,
    paddingHorizontal: 7.5,
    backgroundColor: 'red',
    borderRadius: 90,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
  },
  icon: {
    marginLeft: 4,
  },
});

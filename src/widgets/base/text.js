import {useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text as RNText} from 'react-native';
import Animated from 'react-native-reanimated';

const Text = props => {
  const {
    align,
    animated,
    title,
    subtitle1,
    subtitle2,
    body1,
    body2,
    button,
    caption,
    overline,
    disable,
    spacing,
    style,
    size,
    color,
    justify,
    children,
    ...rest
  } = props;
  const {colors} = useTheme();
  const textStyles = [
    {
      color: colors.text,
      opacity: 1,
    },
    align && {textAlign: align},
    title && styles.title,
    subtitle1 && styles.subtitle_1,
    subtitle2 && styles.subtitle_2,
    body1 && styles.body_1,
    body2 && styles.body_2,
    button && styles.button,
    caption && styles.caption,
    overline && styles.overline,
    disable && styles.disable,
    justify && styles.justify,
    spacing && {letterSpacing: spacing},
    size && {fontSize: size},
    color && {color},
    style && style,
  ];

  if (animated)
    return (
      <Animated.Text allowFontScaling={false} {...rest} style={textStyles}>
        {children}
      </Animated.Text>
    );
  return (
    <RNText allowFontScaling={false} {...rest} style={textStyles}>
      {children}
    </RNText>
  );
};

export default Text;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    lineHeight: 30,
    marginVertical: 2,
    letterSpacing: 0.15,
  },
  subtitle_1: {
    fontSize: 16,
    letterSpacing: 0.15,
  },
  subtitle_2: {
    fontSize: 14,
    letterSpacing: 0.1,
    fontWeight: '500',
  },
  body_1: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
  body_2: {
    fontSize: 14,
    letterSpacing: 0.25,
  },
  button: {
    fontSize: 14,
    letterSpacing: 1.25,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: 12,
    letterSpacing: 0.4,
    lineHeight: 20,
    marginVertical: 2,
  },
  overline: {
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  disable: {
    opacity: 0.6,
  },
  justify: {
    textAlign: 'justify',
  },
});

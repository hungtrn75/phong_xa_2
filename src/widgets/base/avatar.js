import React from 'react';
import {Image as RNImage, StyleSheet, Text as RNText, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../theme';

const Icon = ({icon, size = 64, color = Colors.WHITE, style}) => {
  const iconStyles = [
    {
      width: size + 12,
      height: size + 12,
      borderRadius: size / 2 + 6,
      backgroundColor: Colors.PRIMARY,
      justifyContent: 'center',
      alignItems: 'center',
    },
    style,
  ];
  return (
    <View style={iconStyles}>
      <MaterialCommunityIcons name={icon} size={size} color={color} />
    </View>
  );
};

const Image = ({size = 64, source, style}) => {
  const imageStyles = [
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      overflow: 'hidden',
    },
    style,
  ];
  return (
    <View style={imageStyles}>
      <RNImage
        source={source}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      />
    </View>
  );
};

const Text = props => {
  const {
    size = 64,
    color = Colors.WHITE,
    label,
    style,
    labelStyle,
    dependency = [],
  } = props;

  const textStyles = [
    {
      width: size + 20,
      height: size + 20,
      borderRadius: size / 2 + 10,
      backgroundColor: Colors.PRIMARY,
      justifyContent: 'center',
      alignItems: 'center',
    },
    style,
  ];
  const dependencyList = [props, ...dependency];
  return React.useMemo(
    () => (
      <View style={textStyles}>
        <RNText
          style={[
            labelStyle,
            {
              fontSize: size,
              color,
            },
          ]}>
          {label}
        </RNText>
      </View>
    ),
    [dependencyList],
  );
};

const Avatar = {
  Icon,
  Image,
  Text,
};

export default Avatar;

const styles = StyleSheet.create({});

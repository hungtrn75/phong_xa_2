import {DefaultTheme} from '@react-navigation/native';
import {StyleSheet} from 'react-native';

export const customDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

const ShareStyles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  safeArea: {
    flex: 1,
  },
});

export default ShareStyles;

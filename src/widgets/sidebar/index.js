import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import Block from '../base/block';

const STATUSBAR_HEIGHT = getStatusBarHeight();
const activeTintColor = colors.PRIMARY;
const inactiveTintColor = 'gray';

const getIconTab = (routeName, size, color) => {
  let iconName = 'home';
  switch (routeName) {
    case 'MAP':
      return <Icon name={'map-legend'} size={size} color={color} />;
    case 'HOME':
      return <Icon name={'home'} size={size} color={color} />;
    case 'PROFILE':
      return <Icon name={'account'} size={size} color={color} />;
    default:
      return <Icon name={iconName} size={size} color={color} />;
  }
};
const getnameTab = routeName => {
  switch (routeName) {
    case 'MAP':
      return 'Bản đồ';
    case 'HOME':
      return 'Trang chủ';
    case 'PROFILE':
      return 'Tài khoản';
    default:
      return 'Trang chủ';
  }
};

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Sidebar = props => {
  return (
    <Block style={styles.container}>
      {props.state.routes.map((el, index) => {
        const color =
          index == props.state.index ? activeTintColor : inactiveTintColor;
        return (
          <Block
            key={el.key}
            center
            style={styles.tab}
            onPress={() => props.navigation.navigate(el.name)}>
            {getIconTab(el.name, 36, color)}
            <Text
              style={{
                color,
                fontSize: 14,
                fontWeight: '500',
              }}>
              {getnameTab(el.name)}
            </Text>
          </Block>
        );
      })}
    </Block>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  container: {
    width: 90,
    height: '100%',
    backgroundColor: colors.WHITE,
    position: 'absolute',
    top: 0,
    left: 0,
    paddingTop: STATUSBAR_HEIGHT,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  tab: {
    marginTop: 30,
  },
});

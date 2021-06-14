import React, {useCallback, useMemo} from 'react';
import isEqual from 'react-fast-compare';
import {Alert, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ShareStyles} from '../../theme';
import colors from '../../theme/colors';

const DropdownItem = ({iconName, onPress, isActive, tooltip}) => {
  const btnStyles = useMemo(
    () => [
      styles.btn,
      {
        backgroundColor: isActive ? colors.PRIMARY : colors.WHITE,
      },
    ],
    [isActive],
  );
  const iconColor = useMemo(
    () => (isActive ? colors.WHITE : colors.BLACK),
    [isActive],
  );
  const onLongPress = useCallback(() => {
    Alert.alert(tooltip);
  }, [tooltip]);
  return (
    <TouchableOpacity
      style={btnStyles}
      onPress={onPress}
      onLongPress={onLongPress}>
      <Icon name={iconName} size={24} color={iconColor} />
    </TouchableOpacity>
  );
};

export default React.memo(DropdownItem, isEqual);

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    backgroundColor: colors.WHITE,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    ...ShareStyles.shadow,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.PRIMARY,
  },
});

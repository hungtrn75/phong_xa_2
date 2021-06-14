import {useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {Colors} from '../../theme';
import {MaterialColors} from './../../theme/colors';

const AuthInput = React.forwardRef(
  (
    {
      label,
      style,
      secure,
      keyboardType = 'default',
      close,
      value,
      onChangeText,
      onSubmitEditing,
      autoFocus = false,
    },
    ref,
  ) => {
    const {colors} = useTheme();
    const [secureTextEntry, setSecure] = useState(secure);
    const [isFocus, setFocus] = useState(false);
    return (
      <View
        style={[
          styles.container,
          {
            borderBottomColor: isFocus
              ? Colors.PRIMARY_LIGHT
              : MaterialColors.grey.val(300),
            borderBottomWidth: 1,
          },
        ]}>
        <TextInput
          ref={ref}
          style={[
            styles.input,
            style,
            {
              color: colors.text,
            },
          ]}
          placeholderTextColor={MaterialColors.grey.get()}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          autoFocus={autoFocus}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          placeholder={label}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          value={value}
        />
        {secure ? (
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setSecure(!secureTextEntry)}>
            <Text
              style={{fontWeight: 'bold', color: MaterialColors.grey.val(600)}}>
              {secureTextEntry ? 'HIỆN' : 'ẨN'}
            </Text>
          </TouchableOpacity>
        ) : null}
        {close && value ? (
          <TouchableOpacity style={styles.btn} onPress={() => onChangeText('')}>
            <Icon name="x" color={MaterialColors.grey.val(600)} size={20} />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  },
);

const Input = {
  Auth: AuthInput,
};

export default Input;

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 40,
    fontSize: 16,
    flex: 1,
  },
  btn: {
    width: 42,
    alignItems: 'center',
    zIndex: 10,
  },
});

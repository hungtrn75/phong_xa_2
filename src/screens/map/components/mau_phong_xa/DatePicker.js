import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Block from '../../../../widgets/base/block';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import colors from '../../../../theme/colors';
import isEqual from 'react-fast-compare';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DatePicker = React.memo(({value, onChange}) => {
  const [show, setVisible] = useState(false);
  const hide = () => setVisible(false);
  const onShow = () => setVisible(true);
  const setDate = date => {
    hide();
    onChange(date);
  };
  return (
    <TouchableOpacity onPress={onShow}>
      <Block row center>
        <Icon name="calendar" size={20} color={colors.BUTTON} />
        <Text style={styles.t4}>{moment(value).format('DD/MM/YYYY')}</Text>
      </Block>
      <DateTimePicker
        isVisible={show}
        onConfirm={setDate}
        onCancel={hide}
        date={value}
        locale="vi"
        confirmTextIOS="Chọn"
        cancelTextIOS="Huỷ"
        headerTextIOS="Chọn ngày"
      />
    </TouchableOpacity>
  );
}, isEqual);

export default DatePicker;

const styles = StyleSheet.create({
  wrapTI: {
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 12.5,
    letterSpacing: 0.5,
  },
  t4: {
    letterSpacing: 0.5,
    color: colors.BUTTON,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

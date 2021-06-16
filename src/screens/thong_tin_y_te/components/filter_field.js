import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../theme/colors';
import moment from 'moment';
import SizedBox from '../../../widgets/base/sized_box';
import Block from '../../../widgets/base/block';
import {moderateScale, scale} from '../../../utils/size_matter';

export const FilterField = ({
  label = '',
  placeholder = '',
  display,
  onPress,
  onDelete,
  icon = 'chevron-down',
}) => {
  return (
    <TouchableOpacity style={styles.t1} onPress={onPress}>
      <Text style={styles.t2}>{label}</Text>
      <Block flex={1}>
        <Text style={styles.t3} numberOfLines={1} ellipsizeMode="tail">
          {display || placeholder}
        </Text>
      </Block>
      {display ? (
        <TouchableOpacity onPress={onDelete}>
          <Icon size={20} name={'close'} />
        </TouchableOpacity>
      ) : null}
      {display ? <SizedBox width={5} /> : null}
      <Icon size={20} name={icon} />
    </TouchableOpacity>
  );
};

export const FilterDateField = ({
  label = '',
  placeholder = '',
  display,
  onChange,
  icon = 'chevron-down',
}) => {
  const [show, setVisible] = useState(false);
  const hide = () => setVisible(false);
  const onShow = () => setVisible(true);
  const setDate = date => {
    hide();
    onChange(date);
  };
  return (
    <>
      <TouchableOpacity style={styles.t1} onPress={onShow}>
        <Text style={styles.t2}>{label}</Text>
        <Text style={styles.t3} numberOfLines={1} ellipsizeMode="middle">
          {display ? moment(display).format('DD/MM/YYYY') : placeholder}
        </Text>
        <Icon size={20} name={icon} />
      </TouchableOpacity>
      <DateTimePicker
        key={label}
        isVisible={show}
        onConfirm={setDate}
        onCancel={hide}
        date={display || moment().toDate()}
        locale="vi"
        confirmTextIOS="Chọn"
        cancelTextIOS="Huỷ"
        headerTextIOS="Chọn ngày"
      />
    </>
  );
};

const styles = StyleSheet.create({
  t1: {
    height: moderateScale(52, 0.4),
    borderWidth: 1,
    borderColor: colors.GRAY2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    width: moderateScale(300),
    justifyContent: 'space-between',
  },
  t2: {
    position: 'absolute',
    top: -10,
    left: 10,
    backgroundColor: 'white',
    paddingHorizontal: 5,
    fontSize: 13,
    color: 'gray',
  },
  t3: {
    fontSize: 14,
    letterSpacing: 0.5,
  },
});

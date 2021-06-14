import {useTheme} from '@react-navigation/native';
import * as _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {Modal, Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import {
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants';
import {Colors} from '../../theme';
import colors from '../../theme/colors';
import {cut} from '../../utils/helper';
import {scale} from '../../utils/size_matter';
import Block from '../base/block';
import SizedBox from '../base/sized_box';
import Text from '../base/text';

const pickerColor = colors.GRAY;

const FormField = props => {
  const {
    values,
    label,
    placeholder,
    placeholderLeft,
    searchPlaceholder = 'Tìm kiếm...',
    icon,
    iconLeft,
    iconPress,
    underline = true,
    type = 'picker',
    mode = 'single',
    data = [],
    onChange,
    inputValue,
    onChangeText,
    theme,
    error,
    dropdownStyle,
  } = props;
  const {dark, colors} = useTheme();
  const [isVisible, setVisible] = useState(false);
  const [sourceData, setData] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [filterText, setFilterText] = useState('');
  useEffect(() => {
    if (type === 'picker') {
      setFilterText('');
      if (values?.length) {
        setSelectedValues([...values]);
      } else {
        setSelectedValues([]);
      }
    }
  }, [isVisible]);
  useEffect(() => {
    if (type === 'picker') {
      if (values?.length) {
        setSelectedValues(values);
      }
      if (data?.length) {
        setData(data);
      } else {
        setSelectedValues([]);
        setData([]);
      }
    }
  }, [values, data]);

  const onResetData = () => {
    setVisible(false);
  };
  const onDone = () => {
    if (onChange) onChange(selectedValues);
    setVisible(false);
  };
  const onSearchChange = keyword => {
    setFilterText(keyword);
  };
  const showModal = () => type === 'picker' && setVisible(true);
  const hideModal = () => setVisible(false);
  const onSelectItem = item => () => {
    const selectedIndex = selectedValues.findIndex(ele => ele.id === item.id);
    if (mode === 'single') {
      if (onChange) onChange([item]);
      setSelectedValues([item]);
      setVisible(false);
    } else {
      if (selectedIndex !== -1) {
        selectedValues.splice(selectedIndex, 1);
      } else {
        selectedValues.push(item);
      }
      setSelectedValues([...selectedValues]);
    }
  };
  const renderItem = ({item, index}) => {
    const isChecked = selectedValues.find(el => el.id === item.id);
    return (
      <Block
        row
        key={'md_picker_' + index}
        space="between"
        center
        style={styles.pickerItem}
        onPress={onSelectItem(item)}>
        <Text color={isChecked ? colors.primary : colors.text} size={16}>
          {item.name}
        </Text>
        {isChecked ? (
          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color={colors.primary}
          />
        ) : null}
      </Block>
    );
  };
  const selectedValuesToString = selectedValues.reduce(
    (acc, el) => (acc += el.name + ', '),
    '',
  );
  const renderThemeIsField = () => (
    <>
      <Text style={styles.label}>{label}</Text>
      <Block row center>
        {type === 'picker' ? (
          <Text
            style={[
              styles.placeholder,
              {
                color: selectedValues.length ? colors.text : pickerColor,
                maxWidth: SCREEN_WIDTH * 0.6,
              },
            ]}>
            {selectedValuesToString
              ? cut(
                  selectedValuesToString,
                  selectedValuesToString.length - 2,
                  selectedValuesToString.length,
                )
              : placeholder}
          </Text>
        ) : (
          <TextInput
            value={inputValue}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={pickerColor}
            style={[styles.textInput, {maxWidth: SCREEN_WIDTH * 0.6}]}
            multiline
          />
        )}
        <SizedBox width={5} />
        {icon ? (
          iconPress ? (
            <TouchableWithoutFeedback onPress={iconPress}>
              <MaterialCommunityIcons
                name={icon}
                size={22}
                color={pickerColor}
              />
            </TouchableWithoutFeedback>
          ) : (
            <MaterialCommunityIcons name={icon} size={22} color={pickerColor} />
          )
        ) : null}
      </Block>
    </>
  );

  const renderThemeIsDropdown = () => (
    <>
      <Block row style={[styles.dropdown, dropdownStyle]} center>
        {iconLeft ? (
          <MaterialCommunityIcons
            name={iconLeft}
            size={20}
            color={pickerColor}
            style={{
              marginRight: 10,
            }}
          />
        ) : null}
        {type === 'picker' ? (
          <Text
            style={[
              styles.placeholder,
              {
                color: selectedValues.length ? colors.text : pickerColor,
                flex: 1,
              },
            ]}>
            {selectedValuesToString
              ? cut(
                  selectedValuesToString,
                  selectedValuesToString.length - 2,
                  selectedValuesToString.length,
                )
              : placeholder}
          </Text>
        ) : (
          <TextInput
            value={inputValue}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={pickerColor}
            style={[
              styles.textInput,
              {
                flex: 1,
              },
            ]}
            multiline
          />
        )}
        {type === 'picker' ? (
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color={pickerColor}
            style={{
              marginLeft: 10,
            }}
          />
        ) : placeholderLeft ? (
          <Text color={pickerColor}>{placeholderLeft}</Text>
        ) : null}
      </Block>
    </>
  );
  return (
    <View style={styles.container}>
      <Block row space="between" center onPress={showModal}>
        {theme === 'field' ? renderThemeIsField() : renderThemeIsDropdown()}
      </Block>
      {underline && theme === 'field' ? <View style={styles.line} /> : null}
      {error ? (
        <Text color={Colors.ERROR} style={styles.error}>
          Ban hay kiem tra lai va nhap chinh xac
        </Text>
      ) : null}
      <Modal
        visible={isVisible}
        animationType="slide"
        onRequestClose={hideModal}>
        <Block
          style={{
            height: SCREEN_HEIGHT,
            width: SCREEN_WIDTH,
          }}>
          <SafeAreaView style={{backgroundColor: colors.card}} />
          <Block flex={1} style={{backgroundColor: colors.background}}>
            <Block row style={[styles.header, {backgroundColor: colors.card}]}>
              <Block style={styles.xBtn} onPress={onResetData}>
                <Feather name="x" size={24} color={colors.text} />
              </Block>
              <Block flex={1} middle center>
                <Text style={styles.searchTitle}>{placeholder}</Text>
              </Block>
              {mode === 'multi' ? (
                <Block
                  style={styles.rightHeader}
                  middle
                  center
                  onPress={onDone}>
                  <Text color={colors.primary} size={16}>
                    Lưu
                  </Text>
                </Block>
              ) : (
                <Block style={styles.rightHeader} />
              )}
            </Block>
            <Block
              style={[
                styles.searchBar,
                {
                  backgroundColor: colors.card,
                },
              ]}
              row
              center>
              <Feather name="search" size={28} color={colors.text} />
              <TextInput
                placeholder={searchPlaceholder}
                placeholderTextColor={colors.text}
                style={[
                  styles.searchInput,
                  {
                    color: colors.text,
                  },
                ]}
                onChangeText={_.throttle(onSearchChange, 300)}
              />
            </Block>
            <Block flex={1} style={styles.content}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={sourceData.filter(el =>
                  el.name
                    .toLocaleLowerCase()
                    .includes(filterText.toLocaleLowerCase()),
                )}
                keyExtractor={(item, index) => 'md_picker_' + index}
                renderItem={renderItem}
              />
            </Block>
          </Block>
        </Block>
      </Modal>
    </View>
  );
};

export default FormField;

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  line: {
    height: 1,
    backgroundColor: pickerColor,
    marginBottom: 5,
  },
  picker: {
    paddingVertical: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: pickerColor,
    borderRadius: 4,
    width: '100%',
    paddingVertical: Platform.select({ios: 7.5, android: 0}),
    paddingHorizontal: 10,
    marginVertical: 5,
    minHeight: 45,
  },
  label: {
    color: pickerColor,
    paddingVertical: 7.5,
  },
  placeholder: {
    fontWeight: '500',
    fontSize: 16,
    paddingVertical: 2.5,
  },
  error: {
    fontSize: 13,
  },
  textInput: {
    color: Colors.BLACK,
    fontSize: 16,
    marginBottom: 2,
  },
  header: {
    paddingVertical: 15,
    backgroundColor: Colors.GRAY3,
  },
  xBtn: {
    marginLeft: 15,
  },
  rightHeader: {
    marginRight: 15,
    fontWeight: '500',
  },
  searchBar: {
    paddingVertical: Platform.select({
      android: 0,
      ios: 10,
    }),
    paddingHorizontal: 15,
    borderBottomColor: Colors.GRAY2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    fontSize: 16,
    width: '100%',
    marginLeft: 10,
  },
  content: {
    paddingHorizontal: scale(10),
  },
  pickerItem: {
    borderBottomColor: Colors.GRAY2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 5,
    height: 60,
  },
  values: {
    flexWrap: 'wrap',
  },
  selectedItem: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: scale(10),
    marginTop: scale(5),
  },
  shadow: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    paddingTop: scale(10),
    backgroundColor: 'white',
  },
  sectionText: {
    marginLeft: scale(5),
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});

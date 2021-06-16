import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  InteractionManager,
  SectionList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Block from '../../widgets/base/block';
import SizedBox from '../../widgets/base/sized_box';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import {useRef} from 'react';
import {useCallback} from 'react';
import _ from 'lodash';
import {useState} from 'react';
import {networkHandler} from '../../utils/ErrorHandler';
import axios from '../../utils/axios';
import {useEffect} from 'react';

const DonViThongKe = ({route, navigation}) => {
  const {onChange} = route.params || {};
  const searchTerm = useRef('');
  const input = useRef(null);
  const [txt, setTxt] = useState('');

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      onFilter('');
    });
  }, []);

  const onPress = useCallback(
    item => () => {
      if (onChange && typeof onChange == 'function') {
        onChange(item);
        navigation.goBack();
      }
    },
    [onChange],
  );

  const onReset = () => {
    input.current?.clear();
    searchTerm.current = '';
    setTxt('');
    onFilter('');
  };

  const onFilter = async text => {
    searchTerm.current = text;
    if (text && !text) {
      setTxt(text);
    } else {
      setTxt('');
    }
    try {
      setLoading(true);
      const res = await axios.get(
        `map/layers?subject_types[]=HOSPITAL&subject_types[]=CIVIL_FORCE&limit=10&paginate=false&search=${text}`,
        {
          timeout: 15000,
        },
      );
      setData(res.data.data);
    } catch (error) {
      networkHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const onChangedTextDelayed = useCallback(_.debounce(onFilter, 500), []);
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.item}
        onPress={onPress(item)}>
        <Text style={styles.t1}>{item.name}</Text>
        {item.address ? <Text style={styles.t2}>{item.address}</Text> : null}
      </TouchableOpacity>
    );
  };
  const renderHeader = ({section: {name}}) => (
    <Text style={styles.header}>{name}</Text>
  );
  return (
    <SafeAreaView style={styles.container}>
      <Block row center>
        <Block
          animated
          row
          style={[
            styles.input,
            {
              backgroundColor: colors.GRAY3,
              zIndex: 9,
            },
          ]}
          center>
          <Feather name="search" size={20} color={colors.GRAY} />
          <SizedBox width={10} />
          <TextInput
            ref={input}
            placeholder={'Tìm kiếm theo tên toà nhà'}
            placeholderTextColor={colors.GRAY}
            onChangeText={onChangedTextDelayed}
            style={[styles.textInput]}
          />
          {loading ? (
            <ActivityIndicator color={colors.PRIMARY} />
          ) : txt ? (
            <TouchableOpacity onPress={onReset}>
              <Icon name="close" size={24} color={colors.GRAY} />
            </TouchableOpacity>
          ) : null}
        </Block>
        <SizedBox width={10} height={40} />
      </Block>
      <Block flex={1}>
        <SectionList
          sections={data}
          keyExtractor={(item, index) => `${item.id}`}
          renderItem={renderItem}
          renderSectionHeader={renderHeader}
          contentContainerStyle={styles.s1}
        />
      </Block>
    </SafeAreaView>
  );
};

export default DonViThongKe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: colors.GRAY3,
    borderRadius: 5,
    paddingHorizontal: 10,
    minHeight: 40,
  },
  textInput: {
    maxHeight: 40,
    flex: 1,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  header: {
    fontSize: 18,
    letterSpacing: 0.5,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  item: {
    height: 60,
    borderBottomColor: colors.GRAY2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
  },
  t1: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
  t2: {
    fontSize: 13,
    marginTop: 5,
    letterSpacing: 0.5,
  },
  s1: {
    // paddingTop: 20,
  },
});

import React, {useCallback} from 'react';
import {useEffect} from 'react';
import {useRef} from 'react';
import {useState} from 'react';
import {
  InteractionManager,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from '../../utils/axios';
import {networkHandler} from '../../utils/ErrorHandler';
import _ from 'lodash';
import colors from '../../theme/colors';
import Block from '../../widgets/base/block';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CBNative from '../../utils/CBNative';
import Fab from '../../widgets/base/fab';
import {showMessage} from 'react-native-flash-message';
import {FilterField, FilterDateField} from './components/filter_field';
import SizedBox from '../../widgets/base/sized_box';
import CheckBox from '@react-native-community/checkbox';
import {moderateScale, scale} from '../../utils/size_matter';

const ThongTinYTe = ({navigation}) => {
  const disable = useRef(false);
  const [data, setData] = useState({
    data: [],
    current_page: 0,
    last_page: 1,
  });
  const [filter, setFilter] = useState({
    startTime: moment().subtract(7, 'days').toDate(),
    endTime: moment().toDate(),
    donVi: null,
  });
  const [dateAll, setDateAll] = useState(true);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      onLoad(1, filter);
    });
  }, []);

  const onSelect = () => {
    navigation.navigate('DON_VI_THONG_KE', {
      onChange: val => {
        const n = {
          ...filter,
          donVi: val,
        };
        setFilter(n);
        onLoad(1, n);
      },
    });
  };

  const onOptionChange = val => {
    setDateAll(val);
    onLoad(
      1,
      val
        ? {
            donVi: filter.donVi,
          }
        : {
            ...filter,
            start: moment(filter.startTime).format('DD/MM/YYYY'),
            end: moment(filter.endTime).format('DD/MM/YYYY'),
          },
    );
  };

  const onEndReached = ({distanceFromEnd}) => {
    if (distanceFromEnd < 0) return;
    onLoad(data.current_page + 1, filter);
  };

  const onRefresh = () => {
    onLoad(1, filter);
  };

  const onLoad = async (page, f) => {
    try {
      if (!disable.current) {
        if (page || data.current_page + 1 <= data.last_page) {
          CBNative.show();
          disable.current = false;
          const url = `medical-info?page=${page}&perpage=10&paginate=true&date_start=${
            f?.start || ''
          }&date_end=${f?.end || ''}&report_name_unit_id=${
            f?.donVi?.id || ''
          }&report_name_unit_type=HOSPITAL`;
          console.log(url);
          const res = await axios.get(url);
          const result = res.data.data;
          if (page == 1) {
            setData(result);
          } else {
            setData({
              ...result,
              data: [...data.data, ...result.data],
            });
          }
          CBNative.hide();
        }
      }
    } catch (error) {
      networkHandler(error);
    } finally {
      disable.current = false;
    }
  };

  const onEdit = useCallback(
    item => () => {
      navigation.navigate('ADD_PLACE', {
        formValues: {
          edit: {item},
          type: 2,
          onXoaHanhDongThemMoi: onRefresh,
        },
      });
    },
    [navigation],
  );
  const onDeleteDonVi = () => {
    const n = {...filter, donVi: null};
    setFilter(n);
    onLoad(1, n);
  };
  const onDelete = useCallback(
    item => () => {
      Alert.alert(
        'Xoá thông tin y tế',
        'Dữ liệu sau khi xoá sẽ không được khôi phục.Bạn có chắc chắn muốn xoá hay không?',
        [
          {
            text: 'Lần sau',
          },
          {
            text: 'Xoá',
            onPress: async () => {
              try {
                CBNative.show();
                await axios.delete(`medical-info/${item.id}`);
                showMessage({
                  message: 'Thông báo',
                  description: 'Bạn đã xoá thông báo y tế thành công',
                  type: 'success',
                });
                onLoad(1);
              } catch (error) {
                networkHandler(error);
              } finally {
                CBNative.hide();
              }
            },
          },
        ],
      );
    },
    [navigation],
  );

  const onAdd = useCallback(() => {
    navigation.navigate('ADD_PLACE', {
      formValues: {
        type: 2,
        onXoaHanhDongThemMoi: onRefresh,
      },
    });
  }, [navigation]);

  const onChange = key => val => {
    setFilter({
      ...filter,
      [key]: val,
    });
  };

  const renderItem = ({item, index}) => {
    return (
      <Block key={index} row center style={styles.b2}>
        <Block
          middle
          style={{
            width: headers[0].width,
          }}>
          <Text style={styles.t6}>{item.release_date}</Text>
        </Block>
        <Block
          middle
          style={{
            width: headers[1].width,
          }}>
          <Text style={styles.t6}>{item.report_name_user?.name}</Text>
        </Block>
        <Block
          middle
          style={{
            flex: headers[2].flex,
          }}>
          <Text style={styles.t6}>{item.report_name_unit?.name}</Text>
        </Block>
        <Block
          middle
          center
          style={{
            width: headers[3].width,
          }}>
          <Text style={styles.t6}>{item.available_bed ?? '0'}</Text>
        </Block>
        <Block
          middle
          center
          style={{
            width: headers[4].width,
          }}>
          <Text style={styles.t6}>{item.number_people_infected ?? '0'}</Text>
        </Block>
        <Block
          middle
          center
          style={{
            width: headers[5].width,
          }}>
          <Text style={styles.t6}>{item.number_people_cured ?? '0'}</Text>
        </Block>
        <Block
          middle
          center
          style={{
            width: headers[6].width,
          }}>
          <Text style={styles.t6}>{item.number_people_death ?? '0'}</Text>
        </Block>
        <Block
          middle
          center
          style={{
            width: headers[7].width,
          }}>
          <TouchableOpacity onPress={onEdit(item)}>
            <Icon name="pencil" size={20} color={'orange'} />
          </TouchableOpacity>
        </Block>
        <Block
          middle
          center
          style={{
            width: headers[8].width,
          }}>
          <TouchableOpacity onPress={onDelete(item)}>
            <Icon name="trash-can-outline" size={20} color="red" />
          </TouchableOpacity>
        </Block>
      </Block>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.v1}>
        <Block row center>
          <Icon name="filter" size={24} />
          <Text style={styles.t2}>Bộ lọc</Text>
        </Block>
        <SizedBox height={20} />
        <Block row center>
          <FilterField
            onPress={onSelect}
            onDelete={onDeleteDonVi}
            display={filter.donVi?.name}
            label="Đơn vị báo cáo"
            placeholder="Nhấn để tìm kiếm"
          />
          <SizedBox width={20} />
          <View>
            <Text style={styles.t4}>Ngày báo cáo</Text>
            <Block flex={1} />
            <Block center row>
              <CheckBox
                disabled={false}
                value={dateAll}
                onValueChange={onOptionChange}
              />
              <Text style={styles.t3}>Toàn bộ</Text>
            </Block>
          </View>
          {dateAll ? null : (
            <>
              <SizedBox width={20} />
              <FilterDateField
                label="Ngày bắt đầu"
                placeholder="Nhấn để chọn"
                display={filter.startTime}
                onChange={onChange('startTime')}
                icon="calendar"
              />
              <SizedBox width={20} />
              <FilterDateField
                label="Ngày kết thúc"
                placeholder="Nhấn để chọn"
                display={filter.endTime}
                onChange={onChange('endTime')}
                icon="calendar"
              />
            </>
          )}
        </Block>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={data.data}
        keyExtractor={(item, index) => `${index}`}
        ListHeaderComponent={<ListHeaderComponent />}
        contentContainerStyle={styles.f1}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => onLoad(1, filter)}
            color={colors.PRIMARY}
          />
        }
        onEndReached={_.throttle(onEndReached, 500)}
      />
      <Fab icon="plus" onPress={onAdd} />
    </SafeAreaView>
  );
};

const ListHeaderComponent = () => {
  return (
    <Block row style={styles.b1}>
      {headers.map((el, index) => {
        return (
          <Block
            key={`h_${index}`}
            style={[
              el.width
                ? {
                    width: el.width,
                  }
                : {
                    flex: el.flex,
                  },
            ]}>
            <Text
              style={[
                styles.t5,
                {
                  textAlign: el.center ? 'center' : 'auto',
                },
              ]}>
              {el.label}
            </Text>
          </Block>
        );
      })}
    </Block>
  );
};

export default ThongTinYTe;

const headers = [
  {
    label: 'Ngày báo cáo',
    width: moderateScale(160),
  },
  {
    label: 'Người báo cáo',
    width: moderateScale(150),
  },
  {
    label: 'Đơn vị báo cáo',
    flex: 1,
  },
  {
    label: 'Số giường trống',
    width: moderateScale(130),
    center: true,
  },
  {
    label: 'Số người nhiễm xạ',
    width: moderateScale(140),
    center: true,
  },
  {
    label: 'Số người chữa khỏi',
    width: moderateScale(140),
    center: true,
  },
  {
    label: 'Số người tử vong',
    width: moderateScale(130),
    center: true,
  },
  {
    label: 'Chi tiết',
    width: moderateScale(70),
    center: true,
  },
  {
    label: 'Xoá',
    width: moderateScale(50),
    center: true,
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  f1: {
    paddingHorizontal: 20,
  },
  b1: {
    paddingTop: moderateScale(10),
    height: 50,
    borderColor: colors.GRAY2,
    borderWidth: StyleSheet.hairlineWidth,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: colors.GRAY3,
    paddingLeft: 15,
  },
  b2: {
    minHeight: 50,
    paddingVertical: 5,
    paddingLeft: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.GRAY2,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: colors.GRAY2,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.GRAY2,
  },
  t1: {},
  t2: {
    fontSize: 16,
    letterSpacing: 0.5,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  t3: {
    fontSize: 14,
    letterSpacing: 0.5,
  },
  t4: {
    letterSpacing: 0.5,
    fontSize: 13,
    color: 'gray',
  },
  t5: {
    // textAlign: 'center',
    fontSize: 13,
  },
  t6: {
    fontSize: 13,
  },
  v1: {
    paddingHorizontal: 20,
    marginBottom: 15,
    paddingTop: 15,
  },
});

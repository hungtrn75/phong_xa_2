import _ from 'lodash';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  InteractionManager,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {navigate} from '../../../../navigator/helper';
import {settingsActions} from '../../../../redux/state/setting_redux';
import colors from '../../../../theme/colors';
import Fab from '../../../../widgets/base/fab';
import SizedBox from '../../../../widgets/base/sized_box';
import styles from '../../map.styles';
import moment from 'moment';
import Block from '../../../../widgets/base/block';
import DateTimePicker from 'react-native-modal-datetime-picker';
import DatePicker from './DatePicker';

const f = 'DD/MM/YYYY';
const MauPhongXa = ({
  memoPx,
  camera,
  visible,
  setLoc,
  onSelectAction,
  layMauPhongXa,
  xoaMauPhongXa,
  data,
  location,
}) => {
  if (!visible) return null;
  const [editing, setEditing] = useState(null);
  const [start, setStart] = useState(moment().toDate());
  const [end, setEnd] = useState(moment().toDate());
  const [filtering, setFiltering] = useState(false);

  useEffect(() => {
    if (visible && data.length == 0) {
      InteractionManager.runAfterInteractions(() => {
        layMauPhongXa(1);
      });
    }
    if (!visible) {
      console.log('MauPhongXa');
      memoPx.current = null;
    }
  }, [visible]);

  const onEndReached = ({distanceFromEnd}) => {
    if (distanceFromEnd < 0) return;
    layMauPhongXa();
  };

  const onPress1 = item => () => {
    camera.current?.setCamera({
      centerCoordinate: [+item.longitude, +item.latitude],
      zoomLevel: 16,
      animationDuration: 1000,
    });
  };

  const onPress2 = item => () => {
    Alert.alert(
      'Xoá thông tin mẫu phóng xạ',
      'Dữ liệu sau khi xoá sẽ không được khôi phục.Bạn có chắc chắn muốn xoá hay không?',
      [
        {
          text: 'Lần sau',
        },
        {
          text: 'Xoá',
          onPress: () => xoaMauPhongXa(item.id),
        },
      ],
    );
  };

  const onPress3 = item => () => {
    if (editing) {
      memoPx.current = null;
      setEditing(null);
    } else {
      memoPx.current = item;
      setEditing(item);
      setLoc({
        lat: `${item.latitude}`,
        lon: `${item.longitude}`,
      });
    }
  };

  const onPress4 = () => {
    setFiltering(!filtering);
  };

  const onAdd = useCallback(() => {
    if (location.lat && location.lon) {
      navigate('ADD_PLACE', {
        formValues: {
          type: 3,
          geometry: {
            type: 'Point',
            coordinates: [+location.lon, +location.lat],
          },
        },
      });
    } else {
      Alert.alert(
        'Không thể thêm mới',
        'Bạn chưa đánh dấu vị trí để cung cấp thông tin phóng xạ',
      );
    }
  }, [location]);

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={onPress1(item)}
        key={item.id}
        style={styles2.v1}>
        {item.code ? (
          <Text style={styles.f16}>
            Mã mẫu: <Text>{item.code}</Text>
          </Text>
        ) : null}
        <Text>
          Hoạt độ Ra-226/Th-232/K-40:{' '}
          <Text style={styles.f16}>{`${item.hoat_do_ra_226 || '0'}/${
            item.hoat_do_th_232 || '0'
          }/${item.hoat_do_k_40 || '0'} (Bq/kg)`}</Text>
        </Text>
        <Text>
          Suất liều gamma trong đấ:{' '}
          <Text style={styles.f16}>{`${
            item.suat_lieu_gamma_trong_data || '0'
          } (nGy/h)`}</Text>
        </Text>
        <Text>
          Hoạt độ Rađi tương đương:{' '}
          <Text style={styles.f16}>{`${
            item.hoat_do_radi_tuong_duong || '0'
          } (Bq/kg)`}</Text>
        </Text>
        <Text>{item.date_time}</Text>
        <View style={styles2.v3}>
          <TouchableOpacity
            onPress={onPress3(item)}
            style={[
              styles2.t2,
              {
                backgroundColor: editing?.id == item.id ? 'orange' : 'white',
              },
            ]}>
            <Icon
              name="pencil"
              size={20}
              color={editing?.id == item.id ? 'white' : 'orange'}
            />
          </TouchableOpacity>
          <SizedBox height={10} />
          <TouchableOpacity onPress={onPress2(item)}>
            <Icon name="delete" size={22} color={'red'} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const filterData = useMemo(() => {
    const raw = [...data];
    if (filtering) {
      return raw.filter(el => {
        const k1 = moment(el.date_time, 'DD/MM/YYYY HH:mm:ss');
        const k2 = moment(start).startOf('days');
        const k3 = moment(end).endOf('days');
        return k1.isSameOrAfter(k2) && k1.isBefore(k3);
      });
    }
    return raw;
  }, [data, filtering, start, end]);

  return (
    <View style={[styles.mapTile]}>
      <View style={[styles.wrapTitle, styles.v8]}>
        <TouchableOpacity onPress={onPress4}>
          <Icon
            name={filtering ? 'filter-remove' : 'filter'}
            size={24}
            color={colors.WHITE}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Mẫu phóng xạ</Text>
        <TouchableOpacity onPress={onSelectAction('mauPhongXa')}>
          <Icon name="close" size={28} color={colors.WHITE} />
        </TouchableOpacity>
      </View>

      {filtering ? (
        <>
          <SizedBox height={15} />
          <Block row center>
            <Text style={styles2.t3}>Từ ngày</Text>
            <DatePicker value={start} onChange={setStart} />
            <Text style={styles2.t3}>đến</Text>
            <DatePicker value={end} onChange={setEnd} />
          </Block>
        </>
      ) : null}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filterData}
        keyExtractor={(item, index) => `${item.id}`}
        contentContainerStyle={styles.f1}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => layMauPhongXa(1)}
            color={colors.PRIMARY}
          />
        }
        onEndReached={_.throttle(onEndReached, 500)}
      />
      <Fab icon="plus" onPress={onAdd} />
    </View>
  );
};

const mapStateToProps = ({
  settings: {
    mauPhongXas: {data},
  },
}) => ({
  data,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      layMauPhongXa: settingsActions.layMauPhongXa,
      xoaMauPhongXa: settingsActions.xoaMauPhongXa,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(MauPhongXa);

const styles2 = StyleSheet.create({
  v1: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.GRAY2,
  },
  v2: {
    minWidth: 80,
    paddingVertical: 5,
    backgroundColor: colors.SECONDARY,
    borderRadius: 8,
  },
  t1: {
    fontSize: 16,
    letterSpacing: 0.5,
    color: 'white',
  },
  t3: {
    letterSpacing: 0.5,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  t2: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  t4: {
    letterSpacing: 0.5,
    color: colors.BUTTON,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  v3: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

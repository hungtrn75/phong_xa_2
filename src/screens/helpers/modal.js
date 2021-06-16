import MapboxGL from '@react-native-mapbox-gl/maps';
import {Formik} from 'formik';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import isEqual from 'react-fast-compare';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SCREEN_WIDTH, STATUSBAR_HEIGHT} from '../../constants';
import {settingsActions} from '../../redux/state/setting_redux';
import {ShareStyles} from '../../theme';
import colors from '../../theme/colors';
import Block from '../../widgets/base/block';
import Button from '../../widgets/base/button';
import * as yup from 'yup';
import SizedBox from '../../widgets/base/sized_box';
import {moderateScale} from '../../utils/size_matter';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiaHV1bmdoaXBoYW0iLCJhIjoiY2pseXg2ZTl0MXRkdDN2b2J5bzFpbmlhZSJ9.cChkzU6jLVXx4v75qo_dfQ',
);

const {width, height} = Dimensions.get('window');

const properties = [];

const t1 = 'Trường bắt buộc';

const validationSchema = yup.object().shape({
  number_people_infected: yup.string().required(t1),
  number_people_bleached: yup.string().required(t1),
  number_house_affected: yup.string().required(t1),
  number_house_bleached: yup.string().required(t1),
  region_bleached: yup.string().required(t1),
  statistics_name_unit: yup.object().nullable().required(t1),
});

const validationSchema2 = yup.object().shape({
  available_bed: yup.string().required(t1),
  number_people_cured: yup.string().required(t1),
  number_people_death: yup.string().required(t1),
  number_people_infected: yup.string().required(t1),
  statistics_name_unit: yup.object().nullable().required(t1),
});

const validationSchema3 = yup.object().shape({
  hoat_do_ra_226: yup.string().required(t1),
  hoat_do_th_232: yup.string().required(t1),
  hoat_do_k_40: yup.string().required(t1),
  suat_lieu_gamma_trong_data: yup.string().required(t1),
  hoat_do_radi_tuong_duong: yup.string().required(t1),
  date_time: yup.date().required(t1),
});

const values1 = {
  number_people_infected: '0',
  number_people_bleached: '0',
  number_house_affected: '0',
  number_house_bleached: '0',
  region_bleached: '',
  statistics_name_unit: null,
};
const values2 = {
  available_bed: '0',
  number_people_cured: '0',
  number_people_death: '0',
  number_people_infected: '0',
  statistics_name_unit: null,
};

const values3 = {
  date_time: moment().toDate(),
  hoat_do_ra_226: '0',
  hoat_do_th_232: '0',
  hoat_do_k_40: '0',
  suat_lieu_gamma_trong_data: '0',
  hoat_do_radi_tuong_duong: '0',
};

const AddPlaceModal = ({
  navigation,
  route,
  taoMauPhongXa,
  createLayer,
  profile,
}) => {
  const {edit, onXoaHanhDongThemMoi, geometry, type} = route.params.formValues;

  const [values, setValues] = useState(
    type == 1 ? values1 : type == 2 ? values2 : values3,
  );

  // const [photos, setPhotos] = useState([]);
  // const [documents, setDocuments] = useState({
  //   totalSize: 0,
  //   items: [],
  // });

  //EFFECTS
  useEffect(() => {
    if (edit) {
      const t1 = str => (str ? `${str}` : '0');
      switch (type) {
        case 1:
          let {
            number_people_infected: n1,
            number_people_bleached,
            number_house_affected,
            number_house_bleached,
            region_bleached,
            statistics_name_unit,
          } = edit.item;
          setValues({
            number_people_infected: t1(n1),
            number_people_bleached: t1(number_people_bleached),
            number_house_affected: t1(number_house_affected),
            number_house_bleached: t1(number_house_bleached),
            region_bleached,
            statistics_name_unit,
          });
          break;
        case 2:
          let {
            available_bed,
            number_people_cured,
            number_people_death,
            number_people_infected,
            report_name_unit,
          } = edit.item;
          setValues({
            available_bed: t1(available_bed),
            number_people_cured: t1(number_people_cured),
            number_people_death: t1(number_people_death),
            number_people_infected: t1(number_people_infected),
            statistics_name_unit: report_name_unit,
          });
          break;
        case 3:
          let {
            date_time,
            hoat_do_ra_226,
            hoat_do_th_232,
            hoat_do_k_40,
            suat_lieu_gamma_trong_data,
            hoat_do_radi_tuong_duong,
          } = edit.item;
          setValues({
            date_time: moment(date_time, 'DD/MM/YYYY HH:mm:ss').toDate(),
            hoat_do_ra_226: t1(hoat_do_ra_226),
            hoat_do_th_232: t1(hoat_do_th_232),
            hoat_do_k_40: t1(hoat_do_k_40),
            suat_lieu_gamma_trong_data: t1(suat_lieu_gamma_trong_data),
            hoat_do_radi_tuong_duong: t1(hoat_do_radi_tuong_duong),
          });
          break;

        default:
          break;
      }
    }
  }, []);

  const onSubmit = (values, actions) => {
    const sendData = {};
    //@ts-ignore
    Object.entries(values).map(([key, value]) => {
      if (Array.isArray(value)) {
        sendData[key] = value[0].id;
      } else if (value instanceof Date) {
        sendData[key] = moment(value).format('DD/MM/YYYY HH:mm:ss');
      } else {
        sendData[key] = value;
      }
    });
    if (type == 3) {
      const data2 = {
        layerId: edit?.item?.id,
        geometry,
        values: sendData,
      };
      console.log(JSON.stringify(data2, null, '\t'));
      taoMauPhongXa(data2);
      return;
    }
    const data = {
      type,
      edit,
      onXoaHanhDongThemMoi,
      values:
        type == 1
          ? {
              ...sendData,
              release_date: moment().format('DD/MM/YYYY HH:mm:ss'),
              report_name_user: profile?.user,
            }
          : {
              ...sendData,
              release_date: moment().format('DD/MM/YYYY HH:mm:ss'),
              report_name_user: profile?.user,
              report_name_unit: sendData.statistics_name_unit,
            },
      geometry:
        geometry?.type === 'Polygon'
          ? {
              type: 'Polygon',
              coordinates: [geometry.coordinates],
            }
          : geometry,
    };
    // console.log(JSON.stringify(data, null, '\t'));
    // console.log(profile);
    createLayer(data);
  };

  if (properties.length)
    return (
      <Block center middle flex={1}>
        <Text size={16} body1>
          Biểu mẫu chưa có thông tin cần điền
        </Text>
      </Block>
    );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <Formik
          initialValues={values}
          validationSchema={
            type == 1
              ? validationSchema
              : type == 2
              ? validationSchema2
              : validationSchema3
          }
          enableReinitialize
          validateOnChange={false}
          onSubmit={onSubmit}>
          {({handleSubmit, handleChange, values, setFieldValue, errors}) => {
            if (type == 1)
              return (
                <Block>
                  <Block row wrap space="around">
                    <FormPicker
                      required
                      placeholder="Đơn vị thống kê"
                      navigation={navigation}
                      value={values.statistics_name_unit}
                      error={errors.statistics_name_unit}
                      onChange={val =>
                        setFieldValue('statistics_name_unit', val)
                      }
                    />
                    <TextInputIOS
                      required
                      placeholder={'Số người nhiễm xạ'}
                      value={values.number_people_infected}
                      onChangeText={handleChange('number_people_infected')}
                      error={errors.number_people_infected}
                      keyboardType="numeric"
                    />
                    <TextInputIOS
                      required
                      placeholder={'Số người tẩy xạ'}
                      value={values.number_people_bleached}
                      onChangeText={handleChange('number_people_bleached')}
                      error={errors.number_people_bleached}
                      keyboardType="numeric"
                    />
                    <TextInputIOS
                      required
                      placeholder={'Số nhà ảnh hưởng'}
                      value={values.number_house_affected}
                      onChangeText={handleChange('number_house_affected')}
                      error={errors.number_house_affected}
                      keyboardType="numeric"
                    />
                    <TextInputIOS
                      required
                      placeholder={'Số nhà được tẩy xạ'}
                      value={values.number_house_bleached}
                      onChangeText={handleChange('number_house_bleached')}
                      error={errors.number_house_bleached}
                      keyboardType="numeric"
                    />
                    <TextInputIOS
                      required
                      placeholder={'Khu vực được tẩy xạ'}
                      value={values.region_bleached}
                      onChangeText={handleChange('region_bleached')}
                      error={errors.region_bleached}
                    />
                  </Block>
                  <Block center margin={[20, 0, 0]}>
                    <Button.Ripple
                      title="Gửi thông tin"
                      onPress={handleSubmit}
                    />
                  </Block>
                </Block>
              );
            if (type == 2)
              return (
                <Block>
                  <Block row wrap space="around">
                    <FormPicker
                      required
                      placeholder="Đơn vị thống kê"
                      navigation={navigation}
                      value={values.statistics_name_unit}
                      onChange={val =>
                        setFieldValue('statistics_name_unit', val)
                      }
                      error={errors.statistics_name_unit}
                    />
                    <TextInputIOS
                      required
                      placeholder={'Số giường trống'}
                      value={values.available_bed}
                      onChangeText={handleChange('available_bed')}
                      error={errors.available_bed}
                      keyboardType="numeric"
                    />
                    <TextInputIOS
                      required
                      placeholder={'Số người nhiễm xạ'}
                      value={values.number_people_infected}
                      onChangeText={handleChange('number_people_infected')}
                      error={errors.number_people_infected}
                      keyboardType="numeric"
                    />
                    <TextInputIOS
                      required
                      placeholder={'Số người chữa khỏi'}
                      value={values.number_people_cured}
                      onChangeText={handleChange('number_people_cured')}
                      error={errors.number_people_cured}
                      keyboardType="numeric"
                    />
                    <TextInputIOS
                      required
                      placeholder={'Số người tử vong'}
                      value={values.number_people_death}
                      onChangeText={handleChange('number_people_death')}
                      error={errors.number_people_death}
                      keyboardType="numeric"
                    />
                    <SizedBox width={width * 0.45} />
                  </Block>
                  <Block center margin={[20, 0, 0]}>
                    <Button.Ripple
                      title="Gửi thông tin"
                      onPress={handleSubmit}
                    />
                  </Block>
                </Block>
              );
            return (
              <Block>
                <Block row wrap space="around">
                  <DatePickerIOS
                    placeholder="Thời gian"
                    value={values.date_time}
                    setFieldValue={setFieldValue}
                    name="date_time"
                  />
                  <TextInputIOS
                    required
                    placeholder={'Hoạt độ Ra-226 (Bq/kg)'}
                    value={values.hoat_do_ra_226}
                    onChangeText={handleChange('hoat_do_ra_226')}
                    error={errors.hoat_do_ra_226}
                    keyboardType="numeric"
                  />
                  <TextInputIOS
                    required
                    placeholder={'Hoạt độ Th-232 (Bq/kg)'}
                    value={values.hoat_do_th_232}
                    onChangeText={handleChange('hoat_do_th_232')}
                    error={errors.hoat_do_th_232}
                    keyboardType="numeric"
                  />
                  <TextInputIOS
                    required
                    placeholder={'Hoạt độ K-40 (Bq/kg)'}
                    value={values.hoat_do_k_40}
                    onChangeText={handleChange('hoat_do_k_40')}
                    error={errors.hoat_do_k_40}
                    keyboardType="numeric"
                  />
                  <TextInputIOS
                    required
                    placeholder={'Suất liều gamma trong đất (nGy/h)'}
                    value={values.suat_lieu_gamma_trong_data}
                    onChangeText={handleChange('suat_lieu_gamma_trong_data')}
                    error={errors.suat_lieu_gamma_trong_data}
                    keyboardType="numeric"
                  />
                  <TextInputIOS
                    required
                    placeholder={'Hoạt độ Rađi tương đương (Bq/kg)'}
                    value={values.hoat_do_radi_tuong_duong}
                    onChangeText={handleChange('hoat_do_radi_tuong_duong')}
                    error={errors.hoat_do_radi_tuong_duong}
                    keyboardType="numeric"
                  />
                  <SizedBox width={width * 0.45} />
                </Block>
                <Block center margin={[20, 0, 0]}>
                  <Button.Ripple title="Gửi thông tin" onPress={handleSubmit} />
                </Block>
              </Block>
            );
          }}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = state => ({
  settings: state.settings,
  profile: state.auth.profile,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createLayer: settingsActions.createLayer,
      taoMauPhongXa: settingsActions.taoMauPhongXa,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(AddPlaceModal);

const TextInputIOS = React.memo(
  ({
    placeholder,
    value,
    onChangeText,
    error,
    required = false,
    keyboardType = 'default',
  }) => {
    return (
      <View style={styles.wrapTI}>
        <Text style={styles.title}>
          {placeholder}
          <Text style={styles.error}>{required ? '(*)' : ''}</Text>
          <Text style={styles.error}>{error ? '  ' + error : ''}</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
      </View>
    );
  },
  isEqual,
);

const FormPicker = React.memo(
  ({navigation, placeholder, onChange, value, error, required = false}) => {
    const onPress = useCallback(() => {
      navigation.navigate('DON_VI_THONG_KE', {
        onChange,
      });
    }, [onChange, navigation]);
    return (
      <View style={styles.wrapTI}>
        <Text style={styles.title}>
          {placeholder}
          <Text style={styles.error}>{required ? '(*)' : ''}</Text>
          <Text style={styles.error}>{error ? '  ' + error : ''}</Text>
        </Text>
        <TouchableWithoutFeedback style={styles.input2} onPress={onPress}>
          <Text style={styles.t1} numberOfLines={1} ellipsizeMode="middle">
            {value ? value?.name : 'Nhấn để tìm kiếm'}
          </Text>
          <Icon name="chevron-down" size={20} />
        </TouchableWithoutFeedback>
      </View>
    );
  },
  isEqual,
);

const DatePickerIOS = React.memo(
  ({placeholder, value, setFieldValue, name}) => {
    const [show, setVisible] = useState(false);
    const hide = () => setVisible(false);
    const onShow = () => setVisible(true);
    const setDate = date => {
      hide();
      setFieldValue(name, date);
    };
    return (
      <TouchableOpacity onPress={onShow}>
        <View style={styles.wrapTI}>
          <Text style={styles.title}>{placeholder}</Text>
          <Block middle style={styles.input}>
            <Text style={styles.dateInput}>
              {moment(value).format('DD/MM/YYYY')}
            </Text>
          </Block>
        </View>
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
  },
  isEqual,
);

const styles = StyleSheet.create({
  error: {
    color: colors.ERROR,
    marginLeft: 10,
  },
  wrapTI: {
    marginBottom: moderateScale(20),
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 12.5,
    letterSpacing: 0.5,
  },
  input: {
    fontSize: 15,
    width: width * 0.45,
    height: moderateScale(50, 0.3),
    backgroundColor: colors.GRAY3,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 18,
    letterSpacing: 0.5,
  },
  input2: {
    fontSize: 15,
    width: width * 0.45,
    height: moderateScale(50, 0.3),
    backgroundColor: colors.GRAY3,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  t1: {
    fontSize: 15,
    letterSpacing: 0.5,
  },
  insetBottom: {
    height: 103.5,
  },
  btn: {
    width: 160,
    height: 45,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.BUTTON,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  btn2: {
    minWidth: 160,
    height: 45,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.BUTTON,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  txtBtn: {
    marginLeft: 5,
    fontSize: 15,
    fontWeight: '600',
    color: colors.BUTTON,
  },
  it: {
    fontSize: 15,
    width: width * 0.45,
  },
  inject: {
    marginTop: 10,
  },
  segContaine: {
    width: 400,
    height: 40,
    position: 'absolute',
    top: 20 + STATUSBAR_HEIGHT,
    left: width / 2 - 200,
    flexDirection: 'row',
  },
  txtSeg: {
    fontSize: 18,
    fontWeight: '600',
  },
  indicator: {
    width: 396,
    height: 36,
    backgroundColor: 'white',
    position: 'absolute',
    top: 2,
    left: 2,
    borderRadius: 8,
    ...ShareStyles.shadow,
  },
  drawTools: {
    position: 'absolute',
    width: 600,
    height: 60,
    bottom: 40,
    left: width / 2 - 300,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnTool: {
    backgroundColor: colors.WHITE,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: 150,
    borderRadius: 8,
  },
  txtTool: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '600',
  },
  actions: {
    position: 'absolute',
    bottom: 60,
    right: 40,
  },
  actionFab: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.BUTTON,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  txtAction: {
    fontWeight: '600',
    fontSize: 15,
    color: colors.WHITE,
  },
  backBtn: {
    position: 'absolute',
    left: 50,
    top: STATUSBAR_HEIGHT + 20,
  },
  dateInput: {
    fontSize: 15,
    letterSpacing: 0.5,
  },
});

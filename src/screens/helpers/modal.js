import MapboxGL from '@react-native-mapbox-gl/maps';
import {Formik} from 'formik';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import isEqual from 'react-fast-compare';
import {
  ActionSheetIOS,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {FlatList} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SCREEN_WIDTH, STATUSBAR_HEIGHT} from '../../constants';
import {settingsActions} from '../../redux/state/setting_redux';
import {Colors, ShareStyles} from '../../theme';
import colors from '../../theme/colors';
import AppStorage from '../../utils/storage';
import Block from '../../widgets/base/block';
import Button from '../../widgets/base/button';
import SizedBox from '../../widgets/base/sized_box';
import Text from '../../widgets/base/text';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiaHV1bmdoaXBoYW0iLCJhIjoiY2pseXg2ZTl0MXRkdDN2b2J5bzFpbmlhZSJ9.cChkzU6jLVXx4v75qo_dfQ',
);

const {width, height} = Dimensions.get('window');

const properties = [];

const AddPlaceModal = ({
  navigation,
  route,
  settings,
  getFormField,
  createLayer,
  isFetching,
}) => {
  const [photos, setPhotos] = useState([]);
  const [documents, setDocuments] = useState({
    totalSize: 0,
    items: [],
  });

  //EFFECTS
  useEffect(() => {
    const {
      edit,
      layer: {id},
    } = route.params.formValues;
    // getFormField({formId: id, edit});
  }, []);

  const _onTakePicture = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Huỷ', 'Chụp ảnh', 'Chọn ảnh từ thư viện'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
      },
      async buttonIndex => {
        const size = await AppStorage.getVal('image_size');

        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          const image = await ImagePicker.openCamera({
            cropping: false,
          });

          let {width, height, path} = image;

          switch (size) {
            case '1':
              width *= 0.8;
              height *= 0.8;
              break;
            case '2':
              width *= 0.6;
              height *= 0.6;
              break;
            case '3':
              width *= 0.4;
              height *= 0.4;
              break;

            default:
              break;
          }

          const compressedImg = await ImageResizer.createResizedImage(
            path,
            width,
            height,
            'JPEG',
            80,
          );
          setPhotos([...photos, compressedImg]);
        } else if (buttonIndex === 2) {
          try {
            const images = await ImagePicker.openPicker({
              multiple: true,
            });
            const promises = images.map(async image => {
              let {width, height} = image;
              switch (size) {
                case '1':
                  width *= 0.8;
                  height *= 0.8;
                  break;
                case '2':
                  width *= 0.6;
                  height *= 0.6;
                  break;
                case '3':
                  width *= 0.4;
                  height *= 0.4;
                  break;

                default:
                  break;
              }
              const compressedImg = await ImageResizer.createResizedImage(
                image.path,
                width,
                height,
                'JPEG',
                80,
              );
              return compressedImg;
            });

            const resultImages = await Promise.all(promises);
            setPhotos([...photos, ...resultImages]);
          } catch (error) {
            console.log(error);
          }
        }
      },
    );
  };

  const onDocumentPicker = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      //@ts-ignore
      const size = results.reduce((acc, el) => (acc += el.size), 0);
      setDocuments({
        totalSize: documents.totalSize + size,
        items: [...documents.items, ...results],
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const renderPhoto = ({item, index}) => {
    return (
      <View
        key={item.name}
        style={{
          // backgroundColor: 'red',
          marginRight: 15,
          borderRadius: 4,
        }}>
        <Image
          style={{
            width: 100,
            height: 100,
            borderRadius: 4,
          }}
          resizeMode="cover"
          source={{uri: item.uri}}
        />
        <TouchableOpacity
          onPress={onDeletePhoto(index)}
          style={{
            position: 'absolute',
            right: 5,
            top: 5,
            zIndex: 8,
            borderRadius: 20,
          }}>
          <Icon name="close" color={Colors.ERROR} size={28} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderDocumentItem = ({item, index}) => {
    return (
      <Block row center key={item.name}>
        <Block flex={1}>
          <Text subtitle1>
            {index + 1}. {item.name} - {Math.round(item.size / 1000)} KB
          </Text>
        </Block>
        <TouchableOpacity
          onPress={onDeleteDocument(index)}
          style={{
            marginRight: 10,
            marginVertical: 2.5,
          }}>
          <Icon name="close" size={28} color={Colors.ERROR} />
        </TouchableOpacity>
      </Block>
    );
  };

  const onDeletePhoto = index => () => {
    photos.splice(index, 1);
    setPhotos([...photos]);
  };

  const onDeleteDocument = index => () => {
    documents.totalSize = documents.totalSize - documents.items[index].size;
    documents.items.splice(index, 1);
    setDocuments({...documents, items: [...documents.items]});
  };

  if (properties.length)
    return (
      <Block center middle flex={1}>
        <Text size={16} body1>
          Biểu mẫu chưa có thông tin cần điền
        </Text>
        <SizedBox height={10} />
        <Block row center onPress={navigation.goBack}>
          <Icon name="chevron-left" size={32} color={colors.BUTTON} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              color: colors.BUTTON,
              marginBottom: 2.5,
            }}>
            Quay lại
          </Text>
        </Block>
      </Block>
    );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <SizedBox height={90 + STATUSBAR_HEIGHT} />
        <Formik
          initialValues={{
            number_people_infected: '0',
            number_people_bleached: '0',
            number_house_affected: '0',
            number_house_bleached: '0',
            region_bleached: '',
          }}
          enableReinitialize
          onSubmit={(values, actions) => {
            const sendData = {};
            //@ts-ignore
            Object.entries(values).map(([key, value]) => {
              if (Array.isArray(value)) {
                sendData[key] = value[0].id;
              } else if (value instanceof Date) {
                sendData[key] = moment(value).format('DD/MM/YYYY');
              } else {
                sendData[key] = value;
              }
            });
            const {
              edit,
              layer: {id},
              onXoaHanhDongThemMoi,
              geometry,
            } = route.params.formValues;

            createLayer({
              edit,
              onXoaHanhDongThemMoi: onXoaHanhDongThemMoi,
              documents: documents.items,
              photos,
              mobile_form_id: settings.formFields?.id,
              values: sendData,
              geometry:
                geometry.type === 'Polygon'
                  ? {
                      type: 'Polygon',
                      coordinates: [geometry.coordinates],
                    }
                  : geometry,
            });
          }}>
          {({handleSubmit, handleChange, values, setFieldValue, errors}) => {
            return (
              <Block>
                <Block row wrap space="around">
                  <TextInputIOS
                    placeholder={'Số người bị lây nhiễm'}
                    value={values.number_people_infected}
                    onChangeText={handleChange('number_people_infected')}
                    error={errors.number_people_infected}
                  />
                  <TextInputIOS
                    placeholder={'Số người bị nhiễm'}
                    value={values.number_people_bleached}
                    onChangeText={handleChange('number_people_bleached')}
                    error={errors.number_people_bleached}
                  />
                  <TextInputIOS
                    placeholder={'Số nhà bị ảnh hưởng'}
                    value={values.number_house_affected}
                    onChangeText={handleChange('number_house_affected')}
                    error={errors.number_house_affected}
                  />
                  <TextInputIOS
                    placeholder={'Số nhà bị nhiễm'}
                    value={values.number_house_bleached}
                    onChangeText={handleChange('number_house_bleached')}
                    error={errors.number_house_bleached}
                  />
                  <TextInputIOS
                    placeholder={'Khu vực ảnh hưởng'}
                    value={values.region_bleached}
                    onChangeText={handleChange('region_bleached')}
                    error={errors.region_bleached}
                    keyboardType="numeric"
                  />

                  <SizedBox width={SCREEN_WIDTH * 0.4} />
                </Block>
                <Block row space="around" style={styles.inject}>
                  <View style={styles.it}>
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={_onTakePicture}>
                      <Icon name="file-image" size={24} color={colors.BUTTON} />
                      <Text style={styles.txtBtn}>Ảnh chụp</Text>
                    </TouchableOpacity>
                    <FlatList
                      horizontal
                      data={photos}
                      keyExtractor={(item, index) => item.name}
                      renderItem={renderPhoto}
                    />
                  </View>
                  <View style={styles.it}>
                    <Block row center>
                      <TouchableOpacity
                        style={[styles.btn2]}
                        onPress={onDocumentPicker}>
                        <Icon
                          name="attachment"
                          size={24}
                          color={colors.BUTTON}
                        />
                        <Text style={styles.txtBtn}>
                          Tệp đính kèm
                          {documents.totalSize
                            ? ` - ${Math.round(documents.totalSize / 1000)} KB`
                            : ''}
                        </Text>
                      </TouchableOpacity>
                    </Block>
                    <View style={{height: 100}}>
                      <FlatList
                        data={documents.items}
                        keyExtractor={(item, index) => item.name}
                        renderItem={renderDocumentItem}
                      />
                    </View>
                  </View>
                </Block>
                <Block center>
                  <Button.Ripple title="Gửi thông tin" onPress={handleSubmit} />
                </Block>
              </Block>
            );
          }}
        </Formik>
        <View style={styles.segContaine}>
          <Block flex={1} center middle>
            <Text style={styles.txtSeg}>Thông tin biểu mẫu</Text>
          </Block>
        </View>
        <Block row style={styles.backBtn} center onPress={navigation.goBack}>
          <Icon name="chevron-left" size={32} color={colors.BUTTON} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              color: colors.BUTTON,
              marginBottom: 2.5,
            }}>
            Quay lại
          </Text>
        </Block>
      </ScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = state => ({
  settings: state.settings,
  isFetching: state.share.isFetching,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getFormField: settingsActions.getFormField,
      createLayer: settingsActions.createLayer,
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

const DatePickerIOS = React.memo(
  ({placeholder, value, setFieldValue, name}) => {
    const [show, setVisible] = useState(false);
    const hide = () => setVisible(false);
    const onShow = () => setVisible(true);
    const setDate = date => {
      const prevDate = moment().format('YYYY/MM/DD');
      const nowDate = moment(date).format('YYYY/MM/DD');
      if (nowDate > prevDate) {
        setVisible(false);
      } else {
        setVisible(false);
        setFieldValue(name, date);
      }
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
    marginBottom: 20,
  },
  title: {
    fontWeight: '500',
    color: Colors.BORDER,
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 12.5,
  },
  input: {
    width: SCREEN_WIDTH * 0.4,
    height: 50,
    backgroundColor: colors.GRAY2,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 18,
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.BUTTON,
  },
  it: {
    width: SCREEN_WIDTH * 0.4,
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
    fontSize: 16,
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
    fontSize: 16,
    color: colors.WHITE,
  },
  backBtn: {
    position: 'absolute',
    left: 50,
    top: STATUSBAR_HEIGHT + 20,
  },
  dateInput: {
    fontSize: 16,
  },
});

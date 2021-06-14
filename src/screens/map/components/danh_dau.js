import React from 'react';
import isEqual from 'react-fast-compare';
import {
  ActionSheetIOS,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RELEASE_ENDPOINT} from '../../../constants';
import {Colors} from '../../../theme';
import AppStorage from '../../../utils/storage';
import Block from '../../../widgets/base/block';
import SizedBox from '../../../widgets/base/sized_box';
import styles from '../map.styles';

const initDanhDau = {
  visible: false,
  name: '',
  image: null,
  isEdit: false,
};

function DanhDau({setDanhDau, taoMoiDanhDau, danhDau, visible = false}) {
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
          setDanhDau({
            ...danhDau,
            image: compressedImg,
          });
        } else if (buttonIndex === 2) {
          try {
            const image = await ImagePicker.openPicker({
              multiple: false,
            });
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

            setDanhDau({
              ...danhDau,
              image: compressedImg,
            });
          } catch (error) {
            console.log(error);
          }
        }
      },
    );
  };
  if (!visible) return null;
  return (
    <View pointerEvents="box-none" style={styles.v14}>
      <Block row center space="between" style={styles.p20}>
        <Block>
          <Text style={styles.t6}>
            {danhDau.isEdit ? 'Cập nhật đánh dấu' : 'Thêm đánh dấu'}
          </Text>
          <Text style={styles.t5}>Đánh dấu vùng đang hiển thị</Text>
        </Block>
        <TouchableOpacity
          onPress={() => {
            setDanhDau({...initDanhDau});
          }}>
          <Icon name="close" size={24} color={Colors.GRAY} />
        </TouchableOpacity>
      </Block>
      <Block style={styles.p20}>
        <Text style={styles.t4}>
          Nhập tên <Text style={styles.rq}>(*)</Text>
        </Text>
        <TextInput
          value={danhDau.name}
          onChangeText={text =>
            setDanhDau({
              ...danhDau,
              name: text,
            })
          }
          style={styles.t3}
        />

        <Block center middle style={styles.v13}>
          {danhDau.image ? (
            <Image
              source={{uri: danhDau.image.uri}}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
          ) : null}
        </Block>
      </Block>
      <Block row style={styles.v11}>
        <Block
          onPress={() => {
            setDanhDau({...initDanhDau});
          }}
          middle
          center
          style={styles.v9}>
          <Text style={styles.norTxtBorder}>Huỷ bỏ</Text>
        </Block>
        <Block onPress={taoMoiDanhDau} middle center style={styles.v10}>
          <Text style={styles.norWTxt}>
            {danhDau.isEdit ? 'Cập nhật' : 'Tạo mới'}
          </Text>
        </Block>
      </Block>
    </View>
  );
}

export default React.memo(DanhDau, isEqual);

export const DanhSachDanhDau = ({
  bookmarks,
  setDanhDau,
  onSelectAction,
  camera,
  map,
  xoaDanhDau,
  show,
}) => {
  const onPressCapNhatDanhDau = item => () =>
    setDanhDau({
      visible: true,
      isEdit: `${item.id}`,
      name: item.name,
      image: item.image
        ? {
            id: true,
            name: item.image,
            uri: RELEASE_ENDPOINT + item.image,
          }
        : null,
    });
  const onSetCamera = info => () => {
    if (camera.current) {
      camera.current.setCamera({
        centerCoordinate: [+info.longtitude, +info.latitude],
        zoomLevel: info.zoom,
        animationDuration: 2000,
      });
    }
  };
  //Đánh dấu
  const renderBookmarkItem = ({item, index}) => {
    return (
      <Block
        key={'bm' + index}
        row
        center
        style={styles.bm1}
        onPress={onSetCamera(item)}>
        <Image
          source={
            item.image
              ? {uri: `${RELEASE_ENDPOINT}${item.image}`}
              : require('../../../assets/images/logo.png')
          }
          style={styles.bm2}
          resizeMode="contain"
        />
        <SizedBox width={30} />
        <Block flex={1}>
          <Text style={styles.bm3}>{item.name}</Text>
          <Block row>
            <TouchableOpacity onPress={onPressCapNhatDanhDau(item)}>
              <Icon name="reload" size={24} />
            </TouchableOpacity>
            <SizedBox width={20} />
            <TouchableOpacity onPress={() => xoaDanhDau(item.id)}>
              <Icon name="delete" size={24} />
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
    );
  };
  if (!show) return null;
  return (
    <View style={[styles.mapTile]}>
      <Block flex={1}>
        <View style={[styles.wrapTitle, styles.v8]}>
          <Icon name="bookmark" size={24} color={Colors.WHITE} />
          <Text style={styles.title}>Đánh dấu</Text>
          <TouchableOpacity onPress={onSelectAction('actionShow')}>
            <Icon name="chevron-left" size={28} color={Colors.WHITE} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={bookmarks}
          contentContainerStyle={styles.fl}
          keyExtractor={(item, index) => 'bm' + index}
          renderItem={renderBookmarkItem}
          ListEmptyComponent={
            <Block center>
              <Text style={styles.nodata}>Chưa có dữ liệu</Text>
            </Block>
          }
        />
        <Block
          style={styles.v18}
          onPress={async () => {
            if (map.current) {
              const uri = await map.current.takeSnap(true);

              setDanhDau({
                ...initDanhDau,
                visible: true,
                image: {
                  name: 'asdjasi',
                  uri,
                },
              });
            } else setDanhDau({...initDanhDau, visible: true});
          }}>
          <Icon name="plus-circle" color={Colors.PRIMARY} size={50} />
        </Block>
      </Block>
    </View>
  );
};

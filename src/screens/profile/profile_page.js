import React, {useEffect, useState} from 'react';
import {
  ActionSheetIOS,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {SafeAreaView} from 'react-native-safe-area-context';
import FIcon from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  PROD_ENDPOINT,
  RELEASE_ENDPOINT,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../constants';
import {navigate} from '../../navigator/helper';
import {authActions} from '../../redux/state/auth_redux';
import {shareActions} from '../../redux/state/share_redux';
import {Colors, ShareStyles} from '../../theme';
import colors from '../../theme/colors';
import AppStorage from '../../utils/storage';
import Block from '../../widgets/base/block';
import Button from '../../widgets/base/button';
import SizedBox from '../../widgets/base/sized_box';
import ChangeUrlConfig from '../../widgets/change_url';

const ProfilePage = ({onLogout, updateProfile, changeAvatar, profile}) => {
  const [inputValue, setinputValue] = useState('');
  const [key, setkey] = useState('');
  const [visible, setvisible] = useState(false);
  const [size, setsize] = useState(0);
  const [show, setshow] = useState(0);

  const _onTakePicture = async () => {
    const size = await AppStorage.getVal('image_size');
    let [width, height] = [SCREEN_WIDTH, SCREEN_HEIGHT];

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
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Huỷ', 'Chụp ảnh', 'Chọn ảnh từ thư viện'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
      },
      async buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          const image = await ImagePicker.openCamera({
            cropping: false,
            width,
            height,
          });

          // const compressedImg = await ImageResizer.createResizedImage(
          //   path,
          //   width,
          //   height,
          //   'JPEG',
          //   80,
          // );

          // const imagePath = `${
          //   RNFS.DocumentDirectoryPath
          // }/${new Date().toISOString()}.jpg`.replace(/:/g, '-');

          // if (Platform.OS === 'ios') {
          //   RNFS.copyAssetsFileIOS(compressedImg.uri, imagePath, 0, 0)
          //     .then((res) => {})
          //     .catch((err) => {
          //       console.log('ERROR: image file write failed!!!');
          //       console.log(err.message, err.code);
          //     });
          // }

          changeAvatar({...image, name: image.filename, uri: image.path});
        } else if (buttonIndex === 2) {
          try {
            const image = await ImagePicker.openPicker({
              multiple: false,
              width,
              height,
            });

            // const compressedImg = await ImageResizer.createResizedImage(
            //   image.path,
            //   width,
            //   height,
            //   'JPEG',
            //   80,
            // );

            // const imagePath = `${RNFS.DocumentDirectoryPath}/${compressedImg.name}`.replace(
            //   /:/g,
            //   '-',
            // );

            // console.log(imagePath);

            // if (Platform.OS === 'ios') {
            //   const res = await RNFS.copyAssetsFileIOS(
            //     compressedImg.uri,
            //     imagePath,
            //     0,
            //     0,
            //   );

            //   console.log(res);
            // }

            changeAvatar({...image, name: image.filename, uri: image.path});
          } catch (error) {
            console.log(error);
          }
        }
      },
    );
  };

  const _keyboardDidShow = e => {
    setshow(e.endCoordinates.height);
  };

  const _keyboardDidHide = () => {
    setshow(0);
  };

  useEffect(() => {
    const bootstrap = async () => {
      const size = await AppStorage.getVal('image_size');
      if (size !== null && size !== undefined) {
        setsize(parseInt(size));
      }
    };
    bootstrap();
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const imageSize = () => {
    switch (size) {
      case 1:
        return '80%';
      case 2:
        return '60%';
      case 3:
        return '40%';

      default:
        return 'Kích cỡ thực tế';
    }
  };
  console.log(show);

  return (
    <SafeAreaView
      style={[
        ShareStyles.safeArea,
        {
          backgroundColor: 'white',
        },
      ]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Block flex={1} padding={60}>
          <Block flex={1} style={styles.logoWrap} center>
            <Text style={styles.header}>TÀI KHOẢN</Text>
            <View>
              <Image
                source={
                  profile?.avatar
                    ? {uri: `${RELEASE_ENDPOINT}${profile.avatar}`}
                    : require('../../assets/images/avatar.png')
                }
                style={styles.logoImg}
                resizeMode="cover"
              />
              <Block
                style={styles.cameraBtn}
                middle
                center
                onPress={_onTakePicture}>
                <Block middle center style={styles.sCamera}>
                  <Icon name="camera" size={22} color={Colors.WHITE} />
                </Block>
              </Block>
            </View>
            <Text style={styles.txtName}>{profile?.name}</Text>
            <Block center style={styles.cate1}>
              <Text style={styles.title}>Thông tin người dùng</Text>
              <ProfileItem
                label="Tên"
                value={profile?.name}
                onPress={() => {
                  setkey('name');
                  setinputValue(profile?.name);
                  setvisible(true);
                }}
              />
              <ProfileItem
                label="Số điện thoại"
                value={profile?.mobile}
                onPress={() => {
                  setkey('mobile');
                  setinputValue(profile?.mobile);
                  setvisible(true);
                }}
              />

              <ProfileItem
                label="Địa chỉ"
                value={profile?.address ? profile.address : 'Chưa có'}
                onPress={() => {
                  setkey('address');
                  setinputValue(profile?.address);
                  setvisible(true);
                }}
              />
              <ProfileItem
                label="Mật khẩu"
                value="••••••••"
                hide
                onPress={() => navigate('SIGNUP')}
              />
            </Block>
          </Block>
          <Block flex={1} style={styles.cate2}>
            <Text style={styles.title}>Cài đặt</Text>

            <ProfileItem
              label="Kích cỡ hình ảnh"
              value={imageSize()}
              isSetting
              onPress={() => {
                if (Platform.OS == 'ios') {
                  ActionSheetIOS.showActionSheetWithOptions(
                    {
                      options: [
                        'Kích cỡ thực tế',
                        '80%',
                        '60%',
                        '40%',
                        'Cancel',
                      ],
                      destructiveButtonIndex: 4,
                    },
                    buttonIndex => {
                      if (buttonIndex !== 4) {
                        AppStorage.setVal('image_size', buttonIndex + '');
                        setsize(buttonIndex);
                      }
                    },
                  );
                }
              }}
            />

            <ProfileItem
              label="Đường dẫn"
              value={PROD_ENDPOINT}
              isSetting
              renderRight={() => (
                <ChangeUrlConfig onChangeFinished={() => setkey(key)} />
              )}
              hide
            />
          </Block>
        </Block>
        <Button.Ripple
          title="ĐĂNG XUẤT"
          onPress={onLogout}
          containerStyle={{
            width: 230,
            alignSelf: 'center',
            marginBottom: 30,
          }}
        />
      </ScrollView>
      <Modal isVisible={visible} useNativeDriver>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              width: 400,
              paddingVertical: 15,
              paddingHorizontal: 20,
              backgroundColor: Colors.WHITE,
              marginBottom: show / 2,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '500',
              }}>
              Chỉnh sửa
            </Text>
            <TextInput
              value={inputValue}
              onChangeText={txt => setinputValue(txt)}
              style={{
                fontSize: 18,
                borderBottomColor: Colors.GRAY2,
                borderBottomWidth: StyleSheet.hairlineWidth,
                paddingVertical: 10,
                marginVertical: 15,
              }}
            />
            <Block row space="around">
              <TouchableOpacity onPress={() => setvisible(false)}>
                <Text
                  style={[
                    styles.btnModal,
                    {
                      color: Colors.ERROR,
                    },
                  ]}>
                  Huỷ bỏ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  updateProfile({[key]: inputValue});
                  setvisible(false);
                }}>
                <Text
                  style={[
                    styles.btnModal,
                    {
                      color: '#007aff',
                    },
                  ]}>
                  Đồng ý
                </Text>
              </TouchableOpacity>
            </Block>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const mapStateToProps = state => ({
  colorScheme: state.share.colorScheme,
  profile: state.auth.profile?.user,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onLogout: authActions.requestLogout,
      toggleScheme: shareActions.toggleScheme,
      updateProfile: authActions.updateProfile,
      changeAvatar: authActions.changeAvatar,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);

const ProfileItem = ({
  label,
  value,
  hide = false,
  isSetting = false,
  onPress,
  renderRight,
}) => {
  return (
    <View style={styles.proCon}>
      <Block row middle space="between">
        <View style={styles.proLeft}>
          <Text
            style={{
              fontSize: 16,
              color: Colors.GRAY,
              textTransform: 'uppercase',
              fontWeight: '500',
            }}>
            {label}
          </Text>
        </View>
        <View style={styles.proMid}>
          <Text
            style={{
              fontSize: 16,
              marginLeft: 10,
            }}>
            {value}
          </Text>
        </View>
        {renderRight ? (
          renderRight()
        ) : (
          <TouchableOpacity onPress={onPress}>
            {isSetting ? (
              <FIcon name={'settings'} size={24} color={colors.BORDER} />
            ) : (
              <Icon name={'pencil'} size={24} color={colors.BORDER} />
            )}
          </TouchableOpacity>
        )}
      </Block>
      <SizedBox height={5} />
      <View
        style={[
          styles.proLine,
          {
            backgroundColor: hide ? Colors.WHITE : Colors.GRAY2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cameraBtn: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: Colors.WHITE,
    position: 'absolute',
    bottom: 2,
    right: 5,
  },
  sCamera: {
    backgroundColor: Colors.ACCENT,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
    alignSelf: 'flex-start',
  },
  logoWrap: {backgroundColor: 'white', marginTop: 1},
  logoImg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginTop: 30,
  },
  txtName: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 10,
  },
  cate: {},
  cate1: {
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 40,
    paddingTop: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.GRAY2,
    borderRadius: 8,
  },
  cate2: {
    paddingTop: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.GRAY2,
    borderRadius: 8,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  logoutBtn: {
    width: 200,
    height: 45,
    backgroundColor: Colors.RANGE_NODE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  proCon: {
    width: '100%',
    marginTop: 5,
  },
  proLeft: {
    width: 190,
  },
  proMid: {
    flex: 1,
  },
  proLine: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: Colors.GRAY2,
    marginTop: 10,
    marginBottom: 15,
  },
  header: {
    fontWeight: '600',
    fontSize: 22,
  },
  btnModal: {
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginTop: 10,
  },
});

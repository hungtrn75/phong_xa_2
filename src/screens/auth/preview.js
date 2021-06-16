import {useTheme} from '@react-navigation/native';
import {Formik} from 'formik';
import React, {useRef, useState} from 'react';
import {
  Image as FastImage,
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as yup from 'yup';
import {BOTTOM_HEIGHT, SCREEN_WIDTH, STATUSBAR_HEIGHT} from '../../constants';
import {authActions} from '../../redux/state/auth_redux';
import {Colors} from '../../theme';
import {scale} from '../../utils/size_matter';
import Block from '../../widgets/base/block';
import Button from '../../widgets/base/button';
import SizedBox from '../../widgets/base/sized_box';
import Text from '../../widgets/base/text';
import ChangeUrlConfig from '../../widgets/change_url';

const {width, height} = Dimensions.get('window');

const validationSchema = yup.object().shape({
  username: yup.string().required('Bắt buộc').email('Email không hợp lệ'),
  password: yup
    .string()
    .required('Bắt buộc')
    .min(8, 'Mật khẩu chứa ít nhất 8 ký tự'),
});

const Preview = ({navigation, requestLogin}) => {
  const [show, setshow] = useState(true);

  React.useEffect(() => {
    RNBootSplash.hide({duration: 500});
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, []);

  const _keyboardDidShow = () => {
    setshow(false);
  };

  const _keyboardDidHide = () => {
    setshow(true);
  };

  const {dark, colors} = useTheme();
  const passwordRef = useRef(null);
  const [focustU, setUFocus] = useState(false);
  const [focustP, setPFocus] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const onUsernameSubmitting = () => {
    if (passwordRef) {
      passwordRef.current?.focus();
    }
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{flex: 1}}>
      <Block flex={1} style={styles.container} middle>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Block style={styles.header} center>
            <FastImage
              style={styles.imgBg}
              resizeMode="cover"
              source={require('../../assets/images/phongxa.png')}
            />
            <Text style={styles.lead}>
              Hệ thống giám sát phóng xạ và ứng phó sự cố phóng xạ
            </Text>
          </Block>
          <Text style={styles.title}>Đăng nhập</Text>
          <Formik
            initialValues={{
              username: 'thucdia@khaosatphongxa.com',
              password: '12345678',
            }}
            validationSchema={validationSchema}
            validateOnBlur
            validateOnChange={false}
            onSubmit={(values, actions) => {
              console.log(values);
              requestLogin({
                email: values.username,
                password: values.password,
              });
            }}>
            {({handleSubmit, handleChange, setFieldValue, values, errors}) => (
              <>
                <Block style={styles.form} center>
                  <Block>
                    <Icon
                      name="account"
                      size={24}
                      style={styles.prefix}
                      color={Colors.BORDER}
                    />
                    <TextInput
                      value={values.username}
                      onChangeText={handleChange('username')}
                      placeholderTextColor={Colors.BORDER}
                      style={[
                        styles.input,
                        {
                          borderWidth:
                            focustU || errors.username
                              ? 2
                              : StyleSheet.hairlineWidth,
                          borderColor: errors.username
                            ? Colors.ERROR
                            : focustU
                            ? Colors.BUTTON
                            : Colors.BORDER,
                          paddingRight: 32,
                        },
                      ]}
                      returnKeyType="next"
                      placeholder="Tên đăng nhập"
                      keyboardType="email-address"
                      onSubmitEditing={onUsernameSubmitting}
                      onFocus={() => setUFocus(true)}
                      onBlur={() => setUFocus(false)}
                    />
                    {errors.username ? (
                      <Text style={styles.helperTxt}>{errors.username}</Text>
                    ) : null}
                    {values.username ? (
                      <TouchableOpacity
                        style={styles.action}
                        onPress={() => setFieldValue('username', '')}>
                        <Icon name="close" size={24} color={Colors.BORDER} />
                      </TouchableOpacity>
                    ) : null}
                  </Block>
                  <SizedBox height={scale(20)} />
                  <Block>
                    <Icon
                      name="lock"
                      size={24}
                      style={styles.prefix}
                      color={Colors.BORDER}
                    />
                    <TextInput
                      value={values.password}
                      placeholder="Mật khẩu"
                      placeholderTextColor={Colors.BORDER}
                      onChangeText={handleChange('password')}
                      style={[
                        styles.input,
                        {
                          borderWidth:
                            focustP || errors.password
                              ? 2
                              : StyleSheet.hairlineWidth,
                          borderColor: errors.password
                            ? Colors.ERROR
                            : focustP
                            ? Colors.BUTTON
                            : Colors.BORDER,
                          paddingRight: 75,
                        },
                      ]}
                      secureTextEntry={secureTextEntry}
                      returnKeyType="done"
                      ref={passwordRef}
                      onFocus={() => setPFocus(true)}
                      onBlur={() => setPFocus(false)}
                    />
                    {errors.password ? (
                      <Text style={styles.helperTxt}>{errors.password}</Text>
                    ) : null}
                    {values.password ? (
                      <Block row style={styles.passActions}>
                        <TouchableOpacity
                          style={styles.bt}
                          onPress={() => setSecureTextEntry(!secureTextEntry)}>
                          <Icon
                            name={secureTextEntry ? 'eye-outline' : 'eye'}
                            size={24}
                            color={Colors.BORDER}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.bt}
                          onPress={() => setFieldValue('password', '')}>
                          <Icon name="close" size={24} color={Colors.BORDER} />
                        </TouchableOpacity>
                      </Block>
                    ) : null}
                  </Block>
                </Block>
                <Block style={styles.wrapBtn} center>
                  <Button.Ripple
                    title="Đăng nhập"
                    onPress={handleSubmit}
                    containerStyle={{
                      width: 200,
                    }}
                  />
                </Block>
              </>
            )}
          </Formik>
        </View>
        {show ? (
          <Text subtitle2 style={styles.mark}>
            Copyright@ 2020, Binh Chủng Hoá Học
          </Text>
        ) : null}
      </Block>
      <View
        style={{
          position: 'absolute',
          top: 20 + STATUSBAR_HEIGHT,
          right: 20,
        }}>
        <ChangeUrlConfig />
      </View>
    </ScrollView>
  );
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      requestLogin: authActions.requestLogin,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(Preview);

const styles = StyleSheet.create({
  container: {
    // backgroundColor: Colors.BLACK,
  },
  wrapBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btn: {
    height: 45,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mark: {
    textAlign: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: BOTTOM_HEIGHT,
    color: Colors.BORDER,
  },
  img: {
    width: SCREEN_WIDTH / 2,
    height: SCREEN_WIDTH / 2,
  },
  imgBg: {
    width: scale(200),
    height: scale(200),
  },
  header: {},
  lead: {
    fontSize: 20,
    fontWeight: '600',
    maxWidth: 350,
    textAlign: 'center',
    marginVertical: scale(20),
    textTransform: 'uppercase',
  },
  form: {
    marginVertical: scale(20),
  },
  input: {
    height: 50,
    width: 400,
    fontSize: 16,
    borderRadius: 8,
    paddingLeft: 46,
    paddingRight: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
  },
  helperTxt: {
    marginTop: 5,
    color: Colors.ERROR,
    fontWeight: '500',
  },
  action: {
    position: 'absolute',
    right: 15,
    top: 14,
  },
  passActions: {
    position: 'absolute',
    right: 15,
    top: 14,
  },
  bt: {
    marginLeft: 5,
  },
  prefix: {
    position: 'absolute',
    left: 15,
    top: 12,
  },
  title: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    marginTop: scale(40),
  },
});

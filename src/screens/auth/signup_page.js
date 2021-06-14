import {Formik} from 'formik';
import React from 'react';
import {StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {authActions} from '../../redux/state/auth_redux';
import {MaterialColors} from '../../theme/colors';
import Block from '../../widgets/base/block';
import Fab from '../../widgets/base/fab';
import Input from '../../widgets/base/input';
import Text from '../../widgets/base/text';

const SignupPage = ({changePassword}) => {
  const phoneRef = React.useRef(null);
  const passRef = React.useRef(null);
  return (
    <Formik
      initialValues={{
        old_password: '',
        password: '',
        password_confirmation: '',
      }}
      onSubmit={(values, actions) => {
        changePassword(values);
      }}>
      {({handleSubmit, handleChange, values}) => (
        <Block flex={1} style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Block
              style={[
                styles.header,
                {
                  backgroundColor: MaterialColors.grey.val(100),
                },
              ]}>
              <Text>Nhập đầy đủ thông tin để tạo tài khoản mới</Text>
            </Block>
            <Block flex={1} style={styles.form}>
              <Input.Auth
                label={'Mật khẩu hiện tại'}
                secure
                onChangeText={handleChange('old_password')}
                value={values.old_password}
                onSubmitEditing={() => {
                  //@ts-ignore
                  phoneRef.current.focus();
                }}
              />
              <Input.Auth
                ref={phoneRef}
                label={'Mật khẩu mới'}
                secure
                onChangeText={handleChange('password')}
                value={values.password}
                onSubmitEditing={() => {
                  //@ts-ignore
                  passRef.current.focus();
                }}
              />
              <Input.Auth
                ref={passRef}
                label={'Nhập lại mật khẩu mới'}
                secure
                onChangeText={handleChange('password_confirmation')}
                value={values.password_confirmation}
                onSubmitEditing={handleSubmit}
              />
            </Block>
          </ScrollView>
          <Fab
            icon="arrow-right"
            style={styles.fab}
            backgroundColor={MaterialColors.blue.get()}
            disabled={
              !values.old_password ||
              !values.password_confirmation ||
              !values.password
            }
            onPress={handleSubmit}
          />
        </Block>
      )}
    </Formik>
  );
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changePassword: authActions.changePassword,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(SignupPage);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  form: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
});

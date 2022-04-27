import { useTheme } from "@react-navigation/native";
import { Formik } from "formik";
import React from "react";
import { Keyboard, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { authActions } from "../../redux/state/auth_redux";
import { MaterialColors } from "../../theme/colors";
import Block from "../../widgets/base/block";
import Fab from "../../widgets/base/fab";
import Input from "../../widgets/base/input";
import Text from "../../widgets/base/text";

const LoginPage = ({ login, navigation }) => {
  const passRef = React.useRef(null);

  const { dark } = useTheme();
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      console.log("blur");
      Keyboard.dismiss();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Formik
      initialValues={{ phoneNumber: "", password: "" }}
      onSubmit={(values, actions) => {
        console.log(values);
        login(values);
      }}>
      {({ handleSubmit, handleChange, values }) => (
        <Block flex={1} style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always">
            <Block
              style={[
                styles.header,
                !dark && {
                  backgroundColor: MaterialColors.grey.val(100),
                },
              ]}>
              <Text>
                Vui lòng nhập số điện thoại và mật khẩu để đăng nhập abc
              </Text>
            </Block>
            <Block flex={1} style={styles.form}>
              <Input.Auth
                autoFocus
                label="Số điện thoại"
                close
                value={values.phoneNumber}
                onChangeText={handleChange("phoneNumber")}
                onSubmitEditing={() => {
                  //@ts-ignore
                  passRef.current.focus();
                }}
              />
              <Input.Auth
                ref={passRef}
                label="Mật khẩu"
                secure
                value={values.password}
                onChangeText={handleChange("password")}
                onSubmitEditing={handleSubmit}
              />
            </Block>
          </ScrollView>
          <Fab
            icon="arrow-right"
            style={styles.fab}
            backgroundColor={MaterialColors.blue.get()}
            disabled={!values.phoneNumber || !values.password}
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
      login: authActions.requestLogin,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(LoginPage);

const styles = StyleSheet.create({
  container: {
    backgroundColor: MaterialColors.white,
  },
  form: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    // backgroundColor: MaterialColors.grey.val(100),
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
  },
});

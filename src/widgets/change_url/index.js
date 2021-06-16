import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  PROD_ENDPOINT,
  resetEndpoint,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../constants';
import {Colors} from '../../theme';
import {pushMessage} from '../../utils/flash_message';
import Block from '../base/block';

const ChangeUrlConfig = ({onChangeFinished}) => {
  const [url, setUrl] = useState(PROD_ENDPOINT);
  const [visible, setVisible] = useState(false);
  const _showDrop = () => {
    setVisible(true);
  };
  const _hideDrop = () => {
    setUrl(PROD_ENDPOINT);
    setVisible(false);
  };

  const isUrlValid = userInput => {
    const urlRegex = /(.*):(\d*)\/?(.*)/g;
    const result = userInput.match(urlRegex);
    return result !== null;
  };
  const _onChangeText = txt => setUrl(txt);
  const _onSubmit = async () => {
    setVisible(false);
    if (isUrlValid(url)) {
      await resetEndpoint(url);
      onChangeFinished && onChangeFinished();
    } else {
      pushMessage({
        message: 'Đường dẫn không hợp lệ',
        type: 'danger',
      });
    }
  };
  return (
    <>
      <TouchableOpacity onPress={_showDrop}>
        <Icon name="link" size={30} />
      </TouchableOpacity>
      <Modal onBackdropPress={_hideDrop} useNativeDriver isVisible={visible}>
        <Block flex={1} middle center>
          <Block style={styles.wrap}>
            <Block center>
              <Text style={styles.header}>Đường dẫn ứng dụng</Text>
            </Block>
            <TextInput
              placeholder="Nhập địa chỉ..."
              style={styles.input}
              value={url}
              onChangeText={_onChangeText}
              placeholder={PROD_ENDPOINT}
            />
            <Block row>
              <TouchableOpacity onPress={_hideDrop} style={[styles.btn]}>
                <Text style={styles.cancel}>HUỶ BỎ</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={_onSubmit} style={[styles.btn]}>
                <Text style={styles.submit}>THAY ĐỔI</Text>
              </TouchableOpacity>
            </Block>
          </Block>
        </Block>
      </Modal>
    </>
  );
};

export default ChangeUrlConfig;

const styles = StyleSheet.create({
  modal: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  wrap: {
    backgroundColor: 'white',
    width: 300,
    borderRadius: 4,
  },
  header: {
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 20,
  },
  btn: {
    width: 150,
    height: 40,
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 5,
  },
  cancel: {
    fontSize: 16,
    color: Colors.COLOR_ERROR,
  },
  submit: {
    fontSize: 16,
    color: Colors.BUTTON,
  },
  def: {
    marginHorizontal: 15,
  },
});

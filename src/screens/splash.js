import React, {useEffect} from 'react';
import {ActivityIndicator, Image} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {authActions} from '../redux/state/auth_redux';
import colors from '../theme/colors';
import Block from '../widgets/base/block';

const SplashScreen = ({fetchMe}) => {
  useEffect(() => {
    RNBootSplash.hide({duration: 250});
    fetchMe();
  }, []);
  return (
    <Block
      flex={1}
      middle
      center
      style={{
        backgroundColor: 'white',
      }}>
      <Image
        source={require('../assets/images/phongxa.png')}
        style={{
          width: 150,
          height: 150,
          marginBottom: 20,
        }}
      />
      <ActivityIndicator size="large" color={colors.PRIMARY} />
    </Block>
  );
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchMe: authActions.fetchMe,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(SplashScreen);

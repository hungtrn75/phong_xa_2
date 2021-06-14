import React, {useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ShareStyles} from '../../theme';
import Block from '../../widgets/base/block';

const HomePage = () => {
  useEffect(() => {
    RNBootSplash.hide({duration: 250});
  }, []);

  return (
    <SafeAreaView style={ShareStyles.safeArea}>
      <Block flex={1} middle center>
        <Text>Hiện tại chưa có thông tin gì</Text>
      </Block>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({});

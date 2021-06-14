import NetInfo from '@react-native-community/netinfo';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {offlineActions} from '../../redux/state/offline_redux';
import {settingsActions} from '../../redux/state/setting_redux';

const InternetListener = ({changeInternetStatus, fetchDrafts}) => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      changeInternetStatus(state.isInternetReachable);
    });

    return () => {
      console.log('listener umounted');
      unsubscribe();
    };
  }, []);

  return <View style={styles.container} />;
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeInternetStatus: offlineActions.changeInternetStatus,
      fetchDrafts: settingsActions.fetchDrafts,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(InternetListener);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

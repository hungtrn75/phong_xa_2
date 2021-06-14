import React from 'react';
import {
  ActivityIndicator as RNActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {Colors} from '../../theme';

const Process = ({isFetching, isSync}) => {
  return (
    <View style={styles.container} pointerEvents="box-none">
      {isFetching ? (
        <>
          <View style={styles.overlay} />
          <View
            style={[
              styles.indicator,
              {
                backgroundColor: '#d2dae2',
              },
            ]}>
            <RNActivityIndicator color={Colors.PRIMARY_DARK} size={30} />
            <Text style={styles.txt}>
              {isSync ? 'Đang đồng bộ' : 'Đang xử lý'}
            </Text>
          </View>
        </>
      ) : null}
    </View>
  );
};

const mapStateToProps = state => ({
  isFetching: state.share.isFetching,
  isSync: state.offline.isSync,
});

export default connect(mapStateToProps, null)(Process);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  indicator: {
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 15,
  },
  overlay: {
    opacity: 0.4,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  txt: {
    fontSize: 16,
    marginLeft: 7.5,
    color: Colors.BLACK,
  },
});

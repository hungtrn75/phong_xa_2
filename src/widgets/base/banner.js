import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BaseButton} from 'react-native-gesture-handler';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {useTiming} from 'react-native-redash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../theme';

const {Value, multiply, add} = Animated;
const ELEVATION = 1;
const DEFAULT_MAX_WIDTH = 960;

const Banner = ({actions, icon, children, visible}) => {
  const position = useTiming(visible);
  const [layout, setLayout] = useState({
    height: 0,
    measured: false,
  });

  const handleLayout = ({nativeEvent}) => {
    const {height} = nativeEvent.layout;
    setLayout({height, measured: true});
  };

  const style1 = useAnimatedStyle(() => {
    return {
      height: osition.value * layout.height,
      transform: [{translateY: layout.height * (position.value - 1)}],
    };
  }, [position, layout]);
  const style2 = useAnimatedStyle(() => {
    return {
      transform: [{translateY: layout.height * (position.value - 1)}],
    };
  }, [position, layout]);
  const height = multiply(position, layout.height);
  const translateY = multiply(add(position, -1), layout.height);
  return (
    <View style={[styles.wrapper]}>
      <Animated.View style={style1} />
      <Animated.View
        onLayout={handleLayout}
        style={[
          layout.measured || !visible ? [styles.absolute, style2] : null,
          !layout.measured && !visible ? {opacity: 0} : null,
        ]}>
        <View style={styles.content}>
          {icon ? (
            <View style={styles.icon}>
              <MaterialCommunityIcons name={icon} size={30} />
            </View>
          ) : null}
          <Text style={styles.message}>{children}</Text>
        </View>
        <View style={styles.actions}>
          {actions.map(({label, ...others}, i) => (
            <BaseButton
              key={i}
              style={styles.button}
              {...others}
              rippleColor={Colors.PRIMARY}>
              <Text style={styles.txt}>{label}</Text>
            </BaseButton>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

export default Banner;

const styles = StyleSheet.create({
  container: {
    elevation: ELEVATION,
  },
  wrapper: {
    overflow: 'hidden',
    alignSelf: 'center',
    width: '100%',
    maxWidth: DEFAULT_MAX_WIDTH,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: 8,
    marginTop: 12,
    marginBottom: 0,
  },
  icon: {
    margin: 8,
  },
  message: {
    flex: 1,
    margin: 8,
    fontSize: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: 4,
  },
  button: {
    marginHorizontal: 4,
    paddingHorizontal: 10,
    paddingVertical: 2.5,
  },
  txt: {
    fontSize: 16,
    letterSpacing: 1.25,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: Colors.PRIMARY_DARK,
  },
});

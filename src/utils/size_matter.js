//react-native-size-matters
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

// Default guideline sizes are based on standard ~5" screen mobile device
// This lib uses 350dp x 680dp as guideline sizes
const guidelineBaseWidth = 411.42857142857144;
const guidelineBaseHeight = 683.4285714285714;

// Will return a linear scaled result of the provided size, based on your device's screen width.
const scale = size => (shortDimension / guidelineBaseWidth) * size;

// Will return a linear scaled result of the provided size, based on your device's screen height.
const verticalScale = size => (longDimension / guidelineBaseHeight) * size;

// Sometimes you don't want to scale everything in a linear manner, that's where moderateScale comes in.
// The cool thing about it is that you can control the resize factor (default is 0.5).
// If normal scale will increase your size by +2X, moderateScale will only increase it by +X, for example:
// scale(10) = 20
// moderateScale(10) = 15
// moderateScale(10, 0.1) = 11
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export {scale, verticalScale, moderateScale};

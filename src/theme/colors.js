const colors = {
  //Primary color
  PRIMARY: '#cb2436',
  SECONDARY: '#2BDA8E',
  TERTIARY: '#FFE358',
  PRIMARY_DARK: '#1976d2',
  PRIMARY_LIGHT: '#64B5F6',
  ACCENT: '#F3534A',

  SEMI_LIGHT_GRAY: '#ededed',
  PLACEHOLDER: '#D0D0D0',
  LIGHT_GRAY: '#fafafa',
  GRAY: '#5f6769',
  GRAY2: '#D8D8D8',
  GRAY3: '#F0F0F0',
  GRAY4: '#F7F8FA',
  BG_VIEW: '#F5F5F5',
  DARK_GRAY: '#323643',

  COLOR_INFO: '#5bc0de',
  COLOR_SUCCESS: '#5CC5A7',
  COLOR_WARNING: '#f0ad4e',
  COLOR_ERROR: '#e30c23',
  BORDER: '#8c8c8c',

  INFO: '#5bc0de',
  SUCCESS: '#5CC5A7',
  WARNING: '#f0ad4e',
  ERROR: '#d9534f',
  WHITE: '#ffffff',

  WHITE_BLUR: '#fff6',
  BLACK: 'black',
  TRANSPARENT: 'transparent',

  NOTI_UNREAD: '#E7F3FF',

  RANGE_NODE: '#e30c23',
  RANGE_MID: '#FEEBEB',
  RIPPLE: 'rgba(95, 103, 105, 0.2)',
  BUTTON: '#007aff',
};

export default colors;

class SwatchColor {
  primary;
  swatch;
  constructor(primary, swatch) {
    this.primary = primary;
    this.swatch = swatch;
  }

  get() {
    return this.primary;
  }

  val(index) {
    return this.swatch[index];
  }
}

export class MaterialColors {
  static transparent = 'transparent';
  static black = '#000000';
  static white = '#FFFFFF';
  //blues
  static _bluePrimaryValue = '#2196F3';
  static blue = new SwatchColor(MaterialColors._bluePrimaryValue, {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: MaterialColors._bluePrimaryValue,
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  });
  //reds
  static _redPrimaryValue = '#F44336';
  static red = new SwatchColor(MaterialColors._redPrimaryValue, {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: MaterialColors._redPrimaryValue,
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  });
  //pinks
  static _pinkPrimaryValue = '#E91E63';
  static pink = new SwatchColor(MaterialColors._pinkPrimaryValue, {
    50: '#FCE4EC',
    100: '#F8BBD0',
    200: '#F48FB1',
    300: '#F06292',
    400: '#EC407A',
    500: MaterialColors._pinkPrimaryValue,
    600: '#D81B60',
    700: '#C2185B',
    800: '#AD1457',
    900: '#880E4F',
  });
  //purples
  static _purplePrimaryValue = '#9C27B0';
  static purple = new SwatchColor(MaterialColors._purplePrimaryValue, {
    50: '#F3E5F5',
    100: '#E1BEE7',
    200: '#CE93D8',
    300: '#BA68C8',
    400: '#AB47BC',
    500: MaterialColors._purplePrimaryValue,
    600: '#8E24AA',
    700: '#7B1FA2',
    800: '#6A1B9A',
    900: '#4A148C',
  });
  //deep-purples
  static _deepPurplePrimaryValue = '#673AB7';
  static deepPurple = new SwatchColor(MaterialColors._deepPurplePrimaryValue, {
    50: '#EDE7F6',
    100: '#D1C4E9',
    200: '#B39DDB',
    300: '#9575CD',
    400: '#7E57C2',
    500: MaterialColors._deepPurplePrimaryValue,
    600: '#5E35B1',
    700: '#512DA8',
    800: '#4527A0',
    900: '#311B92',
  });
  //indigo
  static _indigoPrimaryValue = '#3F51B5';
  static indigo = new SwatchColor(MaterialColors._indigoPrimaryValue, {
    50: '#E8EAF6',
    100: '#C5CAE9',
    200: '#9FA8DA',
    300: '#7986CB',
    400: '#5C6BC0',
    500: MaterialColors._indigoPrimaryValue,
    600: '#3949AB',
    700: '#303F9F',
    800: '#283593',
    900: '#1A237E',
  });
  //light-blue
  static _lightBluePrimaryValue = '#03A9F4';
  static lightBlue = new SwatchColor(MaterialColors._lightBluePrimaryValue, {
    50: '#E1F5FE',
    100: '#B3E5FC',
    200: '#81D4FA',
    300: '#4FC3F7',
    400: '#29B6F6',
    500: MaterialColors._lightBluePrimaryValue,
    600: '#039BE5',
    700: '#0288D1',
    800: '#0277BD',
    900: '#01579B',
  });
  //cyan
  static _cyanPrimaryValue = '#00BCD4';
  static cyan = new SwatchColor(MaterialColors._cyanPrimaryValue, {
    50: '#E0F7FA',
    100: '#B2EBF2',
    200: '#80DEEA',
    300: '#4DD0E1',
    400: '#26C6DA',
    500: MaterialColors._cyanPrimaryValue,
    600: '#00ACC1',
    700: '#0097A7',
    800: '#00838F',
    900: '#006064',
  });
  //teal
  static _tealPrimaryValue = '#009688';
  static teal = new SwatchColor(MaterialColors._tealPrimaryValue, {
    50: '#E0F2F1',
    100: '#B2DFDB',
    200: '#80CBC4',
    300: '#4DB6AC',
    400: '#26A69A',
    500: MaterialColors._tealPrimaryValue,
    600: '#00897B',
    700: '#00796B',
    800: '#00695C',
    900: '#004D40',
  });
  //green
  static _greenPrimaryValue = '#4CAF50';
  static green = new SwatchColor(MaterialColors._greenPrimaryValue, {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: MaterialColors._greenPrimaryValue,
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  });
  //lightGreen
  static _lightGreenPrimaryValue = '#8BC34A';
  static lightGreen = new SwatchColor(MaterialColors._lightGreenPrimaryValue, {
    50: '#F1F8E9',
    100: '#DCEDC8',
    200: '#C5E1A5',
    300: '#AED581',
    400: '#9CCC65',
    500: MaterialColors._lightGreenPrimaryValue,
    600: '#7CB342',
    700: '#689F38',
    800: '#558B2F',
    900: '#33691E',
  });
  //lime
  static _limePrimaryValue = '#CDDC39';
  static lime = new SwatchColor(MaterialColors._limePrimaryValue, {
    50: '#F9FBE7',
    100: '#F0F4C3',
    200: '#E6EE9C',
    300: '#DCE775',
    400: '#D4E157',
    500: MaterialColors._limePrimaryValue,
    600: '#C0CA33',
    700: '#AFB42B',
    800: '#9E9D24',
    900: '#827717',
  });
  //yellow
  static _yellowPrimaryValue = '#FFEB3B';
  static yellow = new SwatchColor(MaterialColors._yellowPrimaryValue, {
    50: '#FFFDE7',
    100: '#FFF9C4',
    200: '#FFF59D',
    300: '#FFF176',
    400: '#FFEE58',
    500: MaterialColors._yellowPrimaryValue,
    600: '#FDD835',
    700: '#FBC02D',
    800: '#F9A825',
    900: '#F57F17',
  });
  //amber
  static _amberPrimaryValue = '#FFC107';
  static amber = new SwatchColor(MaterialColors._amberPrimaryValue, {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: MaterialColors._amberPrimaryValue,
    600: '#FFB300',
    700: '#FFA000',
    800: '#FF8F00',
    900: '#FF6F00',
  });
  //orange
  static _orangePrimaryValue = '#FF9800';
  static orange = new SwatchColor(MaterialColors._orangePrimaryValue, {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: MaterialColors._orangePrimaryValue,
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100',
  });
  //deepOrange
  static _deepOrangePrimaryValue = '#FF5722';
  static deepOrange = new SwatchColor(MaterialColors._deepOrangePrimaryValue, {
    50: '#FBE9E7',
    100: '#FFCCBC',
    200: '#FFAB91',
    300: '#FF8A65',
    400: '#FF7043',
    500: MaterialColors._deepOrangePrimaryValue,
    600: '#F4511E',
    700: '#E64A19',
    800: '#D84315',
    900: '#BF360C',
  });
  //brown
  static _brownPrimaryValue = '#795548';
  static brown = new SwatchColor(MaterialColors._brownPrimaryValue, {
    50: '#EFEBE9',
    100: '#D7CCC8',
    200: '#BCAAA4',
    300: '#A1887F',
    400: '#8D6E63',
    500: MaterialColors._brownPrimaryValue,
    600: '#6D4C41',
    700: '#5D4037',
    800: '#4E342E',
    900: '#3E2723',
  });
  //grey
  static _greyPrimaryValue = '#9E9E9E';
  static grey = new SwatchColor(MaterialColors._greyPrimaryValue, {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    350: '#D6D6D6',
    400: '#BDBDBD',
    500: MaterialColors._greyPrimaryValue,
    600: '#757575',
    700: '#616161',
    800: '#424242',
    850: '#303030',
    900: '#212121',
  });
  //blueGrey
  static _blueGreyPrimaryValue = '#607D8B';
  static blueGrey = new SwatchColor(MaterialColors._blueGreyPrimaryValue, {
    50: '#ECEFF1',
    100: '#CFD8DC',
    200: '#B0BEC5',
    300: '#90A4AE',
    400: '#78909C',
    500: MaterialColors._blueGreyPrimaryValue,
    600: '#546E7A',
    700: '#455A64',
    800: '#37474F',
    900: '#263238',
  });
}

import {Platform, StyleSheet} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH, STATUSBAR_HEIGHT} from '../../constants';
import {Colors, ShareStyles} from '../../theme';
import colors from '../../theme/colors';
import {moderateScale, scale} from '../../utils/size_matter';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  f16: {
    fontSize: 14,
    marginBottom: 2.5,
    letterSpacing: 0.5,
  },
  offline: {
    marginBottom: 15,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12.5,
    borderRadius: 6,
    borderColor: colors.GRAY,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  dropdown: {
    position: 'absolute',
    right: 20,
    top:
      10 +
      Platform.select({
        ios: STATUSBAR_HEIGHT,
        android: 0,
      }),
  },
  btn: {
    width: 40,
    height: 40,
    backgroundColor: colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    ...ShareStyles.shadow,
  },
  nodata: {
    fontSize: 14,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.BUTTON,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mapTile: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: moderateScale(400),
    backgroundColor: colors.WHITE,
    bottom: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.WHITE,
  },
  itemBasemap: {
    alignItems: 'center',
    marginBottom: 15,
  },
  thumbnail: {
    height: 80,
    width: 120,
    resizeMode: 'contain',
    borderRadius: 4,
  },
  wrapTitle: {
    backgroundColor: colors.PRIMARY,
    paddingTop: scale(STATUSBAR_HEIGHT + 10),
    justifyContent: 'center',
    paddingLeft: moderateScale(20),
    paddingBottom: moderateScale(20),
  },
  txt: {
    fontSize: 14,
    marginLeft: 15,
    fontWeight: '500',
  },
  footer: {
    height: 56,
    backgroundColor: colors.WHITE,
    paddingRight: 10,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: -4,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
  },
  themMoi: {
    position: 'absolute',
    right: 80,
    bottom: 40,
  },
  boxThemMoi: {
    paddingVertical: 12.5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.PRIMARY,
  },
  tmBg: {
    backgroundColor: colors.WHITE,
    padding: 10,
  },
  tmTxt: {
    marginBottom: 7.5,
    fontSize: 14,
  },
  tmReq: {
    fontSize: 14,
    color: colors.ERROR,
  },
  tmBtnD: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ERROR,
    textAlign: 'center',
  },
  tmBtnA: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.BUTTON,
    textAlign: 'center',
  },
  q: {
    position: 'absolute',
    width: moderateScale(350),
    right: 70,
    top:
      Platform.select({
        ios: STATUSBAR_HEIGHT,
        android: 0,
      }) + 10,
    backgroundColor: colors.WHITE,
    borderRadius: 4,
  },
  w: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  feaItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.BORDER,
  },
  feaTitle: {fontSize: 14, fontWeight: '500'},
  feaSub: {color: colors.GRAY},
  mapTile1: {
    width: 24,
    height: 24,
  },
  lop1: {
    paddingVertical: scale(15.5),
  },
  lop2: {
    fontSize: 14,
    flex: 1,
  },
  lop3: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  cg1: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  cg2: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginVertical: 5,
  },
  cg3: {
    width: 30,
    height: 30,
    borderWidth: 1,

    marginLeft: 10,
    marginVertical: 5,
  },
  cg4: {
    width: 20,
    height: 20,
    borderWidth: 1,
    marginLeft: 15,
    marginVertical: 5,
    borderRadius: 10,
    marginRight: 5,
  },
  cg5: {
    marginVertical: 5,
  },
  cg6: {
    width: 30,
    height: 30,
    borderWidth: 1,

    marginLeft: 10,
    marginVertical: 5,
  },
  cg7: {
    width: 20,
    height: 20,
    borderWidth: 1,

    marginLeft: 15,
    marginVertical: 5,
    borderRadius: 10,
    marginRight: 5,
  },
  cg8: {fontSize: 14, marginLeft: 15, lineHeight: 25},
  p1: {color: 'red'},
  bm1: {
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.BORDER,
    marginBottom: 20,
  },
  bm2: {
    width: 100,
    height: (SCREEN_HEIGHT * 100) / SCREEN_WIDTH,
  },
  bm3: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 15,
  },
  bm4: {
    width: 100,
    height: 30,
    backgroundColor: Colors.GRAY3,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  bm5: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.BUTTON,
  },
  bm6: {
    width: StyleSheet.hairlineWidth,
    height: 30,
    backgroundColor: Colors.GRAY,
  },
  bm7: {
    width: 100,
    height: 30,
    backgroundColor: Colors.GRAY3,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  bm8: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.ERROR,
  },
  addB: {
    position: 'absolute',
    top:
      Platform.select({
        android: 0,
        ios: STATUSBAR_HEIGHT,
      }) + 10,
    left: 20,
  },
  v1: {
    height: 5,
  },
  v2: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  v3: {
    width: 60,
    height: 40,
    borderRadius: 4,
  },
  v4: {
    width: moderateScale(60),
    height: moderateScale(40),
    borderRadius: 4,
    marginLeft: 10,
  },
  v5: {
    height: 40,
    marginLeft: 15,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.BORDER,
  },
  v6: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: colors.BORDER,
    marginVertical: moderateScale(20),
  },
  v7: {
    height: 40,
    width: 100,
    alignSelf: 'center',
  },
  v8: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: moderateScale(10),
  },
  v9: {
    width: 90,
    height: 40,
    backgroundColor: Colors.GRAY2,
    borderRadius: 4,
    marginLeft: 10,
  },
  v10: {
    width: 90,
    height: 40,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 4,
    marginLeft: 10,
  },
  v11: {
    marginVertical: 20,
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
  v12: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: Colors.GRAY2,
  },
  v13: {
    height: 80,
    marginTop: 20,
    backgroundColor: Colors.GRAY3,
    borderRadius: 4,
    width: '100%',
    paddingBottom: 12,
  },
  v14: {
    position: 'absolute',
    left: 20 + 400,
    top: 90,
    width: 450,
    ...ShareStyles.shadow,
    backgroundColor: Colors.WHITE,
    borderRadius: 4,
  },
  v15: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: 40,
    width: 40,
    backgroundColor: colors.PRIMARY,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...ShareStyles.shadow,
  },
  v16: {
    backgroundColor: colors.GRAY3,
    borderWidth: 0,
    height: 50,
  },
  v17: {
    width: 80,
    height: 38,
    backgroundColor: colors.BUTTON,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  v18: {
    position: 'absolute',
    left: 0,
    paddingHorizontal: 20,
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  fl: {
    paddingTop: scale(15),
    paddingHorizontal: scale(15),
  },
  t1: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  t2: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '500',
    marginTop: 15,
  },
  t3: {
    height: 45,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    width: '100%',
    fontSize: 14,
    paddingHorizontal: 10,
  },
  t4: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '500',
  },
  t5: {
    fontSize: 14,
    color: Colors.GRAY,
  },
  t6: {
    fontSize: 18,
    fontWeight: '600',
  },
  norTxt: {fontSize: 14, fontWeight: '500'},
  norWTxt: {
    fontWeight: '500',
    color: colors.WHITE,
    fontSize: 14,
  },
  ltxt: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: moderateScale(15),
  },
  fn: {
    width: 80,
    height: 38,
    backgroundColor: colors.BUTTON,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  p20: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  rq: {
    color: Colors.PRIMARY,
  },
  norTxtBorder: {
    color: Colors.BORDER,
    fontSize: 14,
  },
  t7: {
    fontWeight: '500',
    fontSize: 14,
  },
  i1: {
    width: 24,
    height: 24,
  },
});

export default styles;

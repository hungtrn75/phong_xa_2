import {Dimensions, Platform} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {createAxios} from '../utils/axios';
import AppStorage from '../utils/storage';

export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const STATUSBAR_HEIGHT = getStatusBarHeight();
export const BOTTOM_HEIGHT = getStatusBarHeight();

//API
const DEV_ENDPOINT = 'http://192.168.10.127:8000';
const DEFAULT_ENDPOINT = 'http://phongxa.minhlamweb.com';
export let PROD_ENDPOINT = DEV_ENDPOINT;
export let RELEASE_ENDPOINT = PROD_ENDPOINT;
export let BASE_URL = RELEASE_ENDPOINT + '/api/';

export const resetEndpoint = async url => {
  PROD_ENDPOINT = url;
  RELEASE_ENDPOINT = PROD_ENDPOINT;
  BASE_URL = RELEASE_ENDPOINT + '/api/';
  createAxios(BASE_URL);
  await AppStorage.setVal('base_url', PROD_ENDPOINT);
};

export let route = {
  DANG_NHAP: 'web-authenticate',
  ME: 'me',
  PENDING_FEATURES: 'mobile/user/features',
  DONE_FEATURES: 'features',
  CHU_GIAI: 'layers',
  SUBMITTED_FORM: 'layers',
  FORM_FIELD: 'mobile/forms',
  UPLOAD_DOCUMENT: 'upload/documents',
  CREATE_LAYER: 'mobileforms',
  CREATE_LAYER_2: 'medical-info',
  QUAN_KHU: 'militaryregions',
  TINH_THANH: 'provinces',
  QUAN_HUYEN: 'districts',
  BOOKMARKS: 'bookmarks',
};

//App version
export const VERSION_CODE = 20;
export const VERSION_NAME = '2.0.2';
export const APP_STORE_URL = Platform.select({
  android:
    'https://play.google.com/store/apps/details?id=com.greenstar.manager',
  ios: 'https://apps.apple.com/vn/app/ng%C3%B4i-sao-xanh-qu%E1%BA%A3n-l%C3%BD/id1493150708?l=vi',
});

//Variables
export const initialYear = 2018;

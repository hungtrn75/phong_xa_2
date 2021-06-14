import axios, {AxiosError} from 'axios';
import {showMessage, Position} from 'react-native-flash-message';

import Storage from './storage';
import {BASE_URL} from './../constants/index';
import {pushMessage} from './flash_message';

export function isNetworkError(err) {
  return !!err.isAxiosError && !err.response;
}

export function handleError(error) {
  if (isNetworkError(error)) {
    pushMessage({
      message: 'Không có kết nối mạng!',
      type: 'danger',
    });

    return 1;
  }
  return 0;
}

axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 180000;
axios.defaults.headers = {'Content-Type': 'application/json'};

export const createAxios = url => {
  axios.defaults.baseURL = url;
};

axios.interceptors.request.use(
  async function (config) {
    const token = await Storage.getToken();
    console.log(token);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return Promise.resolve(config);
  },
  function (error) {
    return Promise.reject(error);
  },
);

// axios.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     console.log('error');
//     if (!handleError(error)) {
//       return Promise.reject(error);
//     }
//   },
// );

export default axios;

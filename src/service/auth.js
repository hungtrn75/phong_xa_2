import {route} from '../constants';
import axios from '../utils/axios';

export const login = async userdata => {
  const res = await axios.post(route.DANG_NHAP, userdata, {
    timeout: 10000,
  });

  return res.data;
};

export const me = async () => {
  const res = await axios.get(route.ME);
  return res.data;
};

export const updateProfile = async data => {
  const res = await axios.post(route.ME, data);
  return res.data;
};

export const changePassword = async (userId, data) => {
  const res = await axios.put(`users/${userId}/changePassword`, data);
  return res.data;
};

export const getChuGiais = async () => {
  const res = await axios.get(route.CHU_GIAI);
  return res.data;
};

export const getQuanKhus = async () => {
  try {
    const res = await axios.get(route.QUAN_KHU);
    console.log(res);

    return res.data.data;
  } catch (error) {
    console.log(error, {...error});
    return [];
  }
};

export const getTinhThanhs = async () => {
  try {
    const res = await axios.get(route.TINH_THANH);
    console.log(res);
    return res.data.data;
  } catch (error) {
    console.log(error, {...error});
    return [];
  }
};
export const getQuanHuyens = async () => {
  try {
    const res = await axios.get(route.QUAN_HUYEN);
    return res.data.data;
  } catch (error) {
    console.log(error, {...error});
    return [];
  }
};

export const getAppVersion = async () => {
  try {
    const res = await axios.get('app/version/manager');
    return res.data.data.version;
  } catch (error) {
    return Promise.resolve(Infinity);
  }
};

export const changeAvatar = async image => {
  const formData = new FormData();
  formData.append('avatar_name', image.name);
  formData.append('avatar', {
    uri: image.uri,
    type: 'image/jpg',
    name: image.name,
  });
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const res = await axios.post(route.ME, formData, config);
  return res.data;
};

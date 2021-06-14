import {route} from '../constants';
import axios from '../utils/axios';

export const getForms = async () => {
  const res = await axios.get(route.FORM_FIELD + '?has_properties=true');
  return res.data;
};

export const getFormField = async formId => {
  const res = await axios.get(
    `${route.FORM_FIELD}/${formId}?has_properties=true`,
  );
  return res.data;
};

export const getPendingFeatures = async (type = 'pending') => {
  try {
    const res = await axios.get(`${route.CREATE_LAYER}?per_page=9999`);
    return res.data.data;
  } catch (error) {
    return Promise.resolve([]);
  }
};

export const getDoneFeatures = async () => {
  const res = await axios.get(route.DONE_FEATURES);
  return res.data.data;
};
export const getBookmarks = async () => {
  try {
    const res = await axios.get(route.BOOKMARKS);
    return res.data.data;
  } catch (error) {
    return Promise.resolve([]);
  }
};

export const getSubmittedForm = async ({layerId, featureId}) => {
  const res = await axios.get(
    `${route.SUBMITTED_FORM}/${layerId}/features/${featureId}?visible=true`,
  );
  return res.data.data;
};

export const createLayer = async (
  {documents, photos, mobile_form_id, values, geometry},
  i = null,
) => {
  try {
    const docs = await uploadMultiDocument(documents, mobile_form_id);
    const imgs = await uploadMultiDocument(photos, mobile_form_id);
    const res = await axios.post(route.CREATE_LAYER, {
      ...values,
      geometry,
      documents: [...docs, ...imgs],
    });
    console.log(res);

    return Promise.resolve(i);
  } catch (error) {
    console.log(error, {...error});

    if (typeof i === 'number') return Promise.resolve(-1);
    else return Promise.reject(error);
  }
};

export const updateLayer = async (
  {documents, photos, mobile_form_id, values, geometry},
  layerId,
) => {
  try {
    const docs = await uploadMultiDocument(documents, mobile_form_id);
    const imgs = await uploadMultiDocument(photos, mobile_form_id);
    const res = await axios.patch(`${route.CREATE_LAYER}/${layerId}`, {
      ...values,
      mobile_form_id,
      geometry,
      documents: [...docs, ...imgs],
    });
    return Promise.resolve();
  } catch (error) {
    console.log(error, {...error});
    return Promise.reject(error);
  }
};

export const deleteLayer = async layerId => {
  try {
    const res = await axios.delete(`mobileforms/${layerId}`);
    return res.data;
  } catch (error) {
    console.log(error, {...error});
    return Promise.reject(error);
  }
};

export const createBookmark = async ({
  latitude,
  longtitude,
  name,
  zoom,
  image,
}) => {
  const formData = new FormData();
  formData.append('longtitude', longtitude);
  formData.append('latitude', latitude);
  formData.append('name', name);
  formData.append('zoom', zoom);
  if (image) {
    formData.append('image', {
      uri: image.uri,
      type: 'image/jpg',
      name: image.name,
    });
  }

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const res = await axios.post(route.BOOKMARKS, formData, config);
  return res.data;
};

export const updateBookmark = async ({
  id,
  latitude,
  longtitude,
  name,
  zoom,
  image,
}) => {
  const formData = new FormData();
  formData.append('longtitude', longtitude);
  formData.append('latitude', latitude);
  formData.append('name', name);
  formData.append('zoom', zoom);
  formData.append('_method', 'PATCH');
  if (image && !image.id)
    formData.append('image', {
      uri: image.uri,
      type: 'image/jpg',
      name: image.name,
    });
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const res = await axios.post(`${route.BOOKMARKS}/${id}`, formData, config);
  return res.data;
};

export const deleteBookmark = async id => {
  const res = await axios.delete(`${route.BOOKMARKS}/${id}`);
  return res.data;
};

export const uploadMultiLayer = async layers => {
  let success = [];
  const dataLength = layers.length;
  try {
    for (let i = 0; i < dataLength; i += 5) {
      const requests = layers.slice(i, i + 5).map((item, index) => {
        return createLayer(JSON.parse(item.formFields), index);
      });
      const uploaded = await Promise.all(requests);
      success = [...success, ...uploaded.filter(el => el !== -1)];
    }
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }

  return Promise.resolve(success);
};
export const uploadMultiDocument = async (files, mobile_form_id) => {
  let success = [];
  const dataLength = files.length;
  try {
    for (let i = 0; i < dataLength; i += 5) {
      const requests = files.slice(i, i + 5).map(item => {
        if (!item.id) return uploadDocument(item, mobile_form_id);
        return Promise.resolve(item.id);
      });
      const uploaded = await Promise.all(requests);
      success = [...success, ...uploaded];
    }
    return success;
  } catch (error) {
    console.log(error, {...error});
    return Promise.reject(error);
  }
};

export const uploadDocument = async ({uri, name, type}, mobile_form_id) => {
  const formData = new FormData();
  formData.append('mobile_form_id', mobile_form_id);
  formData.append('file', {
    uri,
    type,
    name,
  });

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return new Promise((resolve, reject) => {
    axios.post(route.UPLOAD_DOCUMENT, formData, config).then(
      response => {
        if (response.data?.data?.id) resolve(response.data.data.id);
        else reject('asdjias');
      },
      error => {
        console.log({...error});
        reject(error);
      },
    );
  });
};

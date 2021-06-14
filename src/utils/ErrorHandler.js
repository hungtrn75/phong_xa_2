import {showMessage} from 'react-native-flash-message';

export const networkHandler = (err, message = 'Có lỗi xảy ra') => {
  console.log(err, JSON.stringify({...err}, null, '\t'));
  const isNetworkError = !!err.isAxiosError && !err.response;
  if (isNetworkError) {
    showMessage({
      message: 'Không có kết nối mạng!',
      type: 'danger',
      icon: {icon: 'danger', position: 'left'},
    });
  } else {
    const description =
      err?.response?.data?.message ?? err?.message ?? JSON.stringify(err);
    showMessage({
      message,
      description,
      type: 'danger',
    });
  }
};

// .toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })

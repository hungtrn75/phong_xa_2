import NetInfo from '@react-native-community/netinfo';
import {showMessage} from 'react-native-flash-message';
import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {insertQuery, selectQuery} from '../../database/sqlite';
import {goBack} from '../../navigator/helper';
import {AuthService, LayerService} from '../../service';
import {
  capNhatMauPhongXa,
  layDSMauPhongXa,
  xoaMauPhongXa,
} from '../../service/layer';
import CBNative from '../../utils/CBNative';
import {networkHandler} from '../../utils/ErrorHandler';
import {pushMessage} from '../../utils/flash_message';
import AppStorage from '../../utils/storage';
import {authTypes} from '../state/auth_redux';
import {settingTypes} from '../state/setting_redux';
import {sharedTypes} from '../state/share_redux';

function* toggleSchemeWorker(action) {
  try {
    const colorScheme = yield select(state => state.share.colorScheme);

    yield call(AppStorage.setVal, 'pp_scheme', colorScheme);
  } catch (error) {
    console.log('helper', error);
  }
}

export function* toggleSchemeWatcher() {
  yield takeLatest(sharedTypes.TOGGLE_SCHEME, toggleSchemeWorker);
}

function* getFormFieldWorker(action) {
  try {
    CBNative.show();
    const {formId, edit} = action.payload;
    const forms = yield select(state => state.settings.forms);
    const form = forms.find(el => el.id === formId);
    if (form) {
      const {isInternetReachable} = yield call(NetInfo.fetch);
      if (edit && isInternetReachable) {
        const [submittedForm] = yield all([
          call(LayerService.getSubmittedForm, edit),
        ]);
        yield put({
          type: settingTypes.GET_FORM_FIELD_SUCCESS,
          payload: {formFields: form, submittedForm},
        });
      } else {
        yield put({
          type: settingTypes.GET_FORM_FIELD_SUCCESS,
          payload: {formFields: form},
        });
      }
    } else {
      yield put({
        type: settingTypes.GET_FORM_FIELD_SUCCESS,
        payload: null,
      });
    }
  } catch (error) {
    networkHandler(error);
    yield put({
      type: settingTypes.GET_FORM_FIELD_SUCCESS,
      payload: null,
    });
  } finally {
    CBNative.hide();
  }
}

export function* getFormFieldWatcher() {
  yield takeLatest(settingTypes.GET_FORM_FIELD, getFormFieldWorker);
}

function* createLayerWorker(action) {
  try {
    CBNative.show();
    const {isConnected} = yield call(NetInfo.fetch);
    const {onXoaHanhDongThemMoi, edit, ...rest} = action.payload;
    if (isConnected) {
      let res;
      if (edit?.item?.id) {
        yield call(LayerService.updateLayer, rest, edit.item.id);
      } else yield call(LayerService.createLayer, rest);
      if (action.payload.type == 1) {
        const [pendingFeatures] = yield all([
          call(LayerService.getPendingFeatures),
        ]);

        const tPendingFeatures = pendingFeatures.map(el => ({
          feature_id: el.id,
          json: JSON.stringify(el),
        }));

        yield call(insertQuery, [], tPendingFeatures, 'tbl_pending_features');

        yield put({
          type: settingTypes.FETCH_PENDING_FEARTURES_SUCCESS,
          payload: pendingFeatures,
        });
      }

      if (edit?.item?.id) {
        pushMessage({
          message: 'Dữ liệu cập nhật thành công',
          type: 'success',
        });
      } else {
        pushMessage({
          message: 'Dữ liệu tạo mới thành công',
          type: 'success',
        });
      }
      if (typeof onXoaHanhDongThemMoi == 'function')
        yield call(onXoaHanhDongThemMoi);
    } else {
      showMessage({
        message: 'Không có kết nối mạng',
        description: 'Vui lòng kiểm tra lại kết nội mạng để tiếp tục',
        type: 'danger',
      });
      // const rDrafts = [
      //   {
      //     json: JSON.stringify({...rest, edit}),
      //     error: '',
      //     status: 1,
      //   },
      // ];
      // yield call(insertQuery, [], rDrafts, 'tbl_drafts');
      // const {rows} = yield call(selectQuery, 'SELECT * FROM tbl_drafts', []);

      // let drafts = [];
      // for (let i = 0; i < rows.length; i++) {
      //   var item = rows.item(i);
      //   drafts.push({
      //     ...item,
      //     json: JSON.parse(item.json),
      //   });
      // }
      // yield put({
      //   type: settingTypes.FETCH_DRAFTS_SUCCESS,
      //   payload: drafts,
      // });
      // action.payload?.onXoaHanhDongThemMoi();
      // pushMessage({
      //   message: 'Dữ liệu của bạn sẽ được đồng bộ sau khi kết nối lại internet',
      //   type: 'success',
      // });
    }
    goBack();
  } catch (error) {
    console.log('helper', error, {...error});
    const message =
      error.response?.data.message ?? 'Có lỗi xảy ra.Vui lòng thử lại sau';
    if (message)
      pushMessage({
        message,
        type: 'danger',
      });
  } finally {
    CBNative.hide();
  }
}

export function* createLayerWatcher() {
  yield takeLatest(settingTypes.CREATE_LAYER, createLayerWorker);
}

function* deleteLayerWorker(action) {
  try {
    CBNative.show();

    yield call(LayerService.deleteLayer, action.payload);
    const [pendingFeatures] = yield all([
      call(LayerService.getPendingFeatures),
    ]);
    const tPendingFeatures = pendingFeatures.map(el => ({
      feature_id: el.id,
      json: JSON.stringify(el),
    }));

    yield call(insertQuery, [], tPendingFeatures, 'tbl_pending_features');

    yield put({
      type: settingTypes.FETCH_PENDING_FEARTURES_SUCCESS,
      payload: pendingFeatures,
    });
    pushMessage({
      message: 'Xoá thông tin thực địa thành công',
      type: 'success',
    });
  } catch (error) {
    console.log('helper', error, {...error});
  } finally {
    CBNative.hide();
  }
}

export function* deleteLayerWatcher() {
  yield takeLatest(settingTypes.DELETE_LAYER, deleteLayerWorker);
}

function* updateBookmarkWorker(action) {
  try {
    CBNative.show();
    const {callback, ...rest} = action.payload;
    const res = yield call(LayerService.updateBookmark, rest);
    const bookmarks = yield call(LayerService.getBookmarks);
    yield put({
      type: settingTypes.GET_BOOKMARKS_SUCCESS,
      payload: bookmarks,
    });
    callback();
  } catch (error) {
    networkHandler(error);
  } finally {
    CBNative.hide();
  }
}

export function* updateBookmarkWatcher() {
  yield takeLatest(settingTypes.UPDATE_BOOKMARK, updateBookmarkWorker);
}

function* createBookmarkWorker(action) {
  try {
    CBNative.show();
    const {callback, ...rest} = action.payload;
    const res = yield call(LayerService.createBookmark, rest);
    const bookmarks = yield call(LayerService.getBookmarks);
    yield put({
      type: settingTypes.GET_BOOKMARKS_SUCCESS,
      payload: bookmarks,
    });
    callback();
  } catch (error) {
    networkHandler(error);
  } finally {
    CBNative.hide();
  }
}

export function* createBookmarkWatcher() {
  yield takeLatest(settingTypes.CREATE_BOOKMARK, createBookmarkWorker);
}

function* deleteBookmarkWorker(action) {
  try {
    CBNative.show();
    const res = yield call(LayerService.deleteBookmark, action.payload);
    const bookmarks = yield call(LayerService.getBookmarks);
    yield put({
      type: settingTypes.GET_BOOKMARKS_SUCCESS,
      payload: bookmarks,
    });
    console.log(res);
  } catch (error) {
    networkHandler(error);
  } finally {
    CBNative.hide();
  }
}

export function* deleteBookmarkWatcher() {
  yield takeLatest(settingTypes.DELETE_BOOKMARK, deleteBookmarkWorker);
}

function* refreshDataWorker(action) {
  try {
    const {isConnected} = yield call(NetInfo.fetch);
    action?.payload();
    if (isConnected) {
      CBNative.show();

      const [resMe, pendingFeatures, {layers, features}, bookmarks] = yield all(
        [
          call(AuthService.me),
          call(LayerService.getPendingFeatures),
          call(LayerService.getDoneFeatures),
          call(LayerService.getBookmarks),
        ],
      );
      yield call(AppStorage.setVal, 'resMe', JSON.stringify(resMe));
      yield put({
        type: authTypes.REQUEST_LOGIN_SUCCESS,
        payload: resMe,
      });

      const tPendingFeatures = pendingFeatures.map(el => ({
        feature_id: el.id,
        json: JSON.stringify(el),
      }));
      const tFeatures = features.map(el => ({
        feature_id: el.id,
        json: JSON.stringify(el),
      }));
      const tLayers = layers.map(el => ({
        layer_id: el.id,
        json: JSON.stringify(el),
      }));
      yield call(insertQuery, [], tPendingFeatures, 'tbl_pending_features');
      yield call(insertQuery, [], tFeatures, 'tbl_features');
      yield call(insertQuery, [], tLayers, 'tbl_layers');

      const {rows} = yield call(selectQuery, 'SELECT * FROM tbl_drafts', []);

      let drafts = [];
      for (let i = 0; i < rows.length; i++) {
        var item = rows.item(i);
        drafts.push({
          ...item,
          json: JSON.parse(item.json),
        });
      }

      yield put({
        type: settingTypes.GET_FEATURES_SUCCESS,
        payload: {layers, features},
      });
      yield put({
        type: settingTypes.FETCH_DRAFTS_SUCCESS,
        payload: drafts,
      });
      yield put({
        type: settingTypes.FETCH_PENDING_FEARTURES_SUCCESS,
        payload: pendingFeatures,
      });

      yield put({
        type: settingTypes.GET_BOOKMARKS_SUCCESS,
        payload: bookmarks,
      });
    } else {
    }
  } catch (error) {
    networkHandler(error);
  } finally {
    CBNative.hide();
  }
}

export function* refreshDataWatcher() {
  yield takeLatest(settingTypes.REFRESH_DATA, refreshDataWorker);
}

function* layMauPhongXaWorker(action) {
  try {
    const {isConnected} = yield call(NetInfo.fetch);
    if (isConnected) {
      const {c, l, d} = yield select(
        ({
          settings: {
            mauPhongXas: {current_page: c, last_page: l, data: d},
          },
        }) => ({
          c,
          l,
          d,
        }),
      );
      let nPage = c + 1;
      if (action.payload == 1) {
        nPage = 1;
      }
      if (nPage <= l) {
        CBNative.show();
        const res = yield call(layDSMauPhongXa, nPage);
        yield put({
          type: settingTypes.LAY_MAU_PHONG_XA_SUCCESS,
          payload:
            nPage == 1
              ? {
                  data: res.data,
                  current_page: res.current_page,
                  last_page: res.last_page,
                }
              : {
                  data: [...d, res.data],
                  current_page: res.current_page,
                  last_page: res.last_page,
                },
        });
      }
    } else {
      showMessage({
        message: 'Không có kết nối mạng',
        description: 'Vui lòng kiểm tra lại kết nội mạng để tiếp tục',
        type: 'danger',
      });
    }
  } catch (error) {
    networkHandler(error);
  } finally {
    CBNative.hide();
  }
}

export function* layMauPhongXaWatcher() {
  yield takeLatest(settingTypes.LAY_MAU_PHONG_XA, layMauPhongXaWorker);
}

function* capNhatMauPhongXaWorker(action) {
  try {
    CBNative.show();
    yield call(capNhatMauPhongXa, action.payload);
    showMessage({
      message: 'Thông báo',
      description: action.payload.layerId
        ? 'Cập nhật thông tin thành công'
        : 'Tạo mới thông tin thành công',
      type: 'success',
    });
    const res = yield call(layDSMauPhongXa, 1);
    yield put({
      type: settingTypes.LAY_MAU_PHONG_XA_SUCCESS,
      payload: {
        data: res.data,
        current_page: res.current_page,
        last_page: res.last_page,
      },
    });
    goBack();
  } catch (error) {
    networkHandler(error);
  } finally {
    CBNative.hide();
  }
}

export function* capNhatMauPhongXaWatcher() {
  yield takeLatest(settingTypes.TAO_MAU_PHONG_XA, capNhatMauPhongXaWorker);
}

function* xoaMauPhongXaWorker(action) {
  try {
    CBNative.show();
    yield call(xoaMauPhongXa, action.payload);
    showMessage({
      message: 'Thông báo',
      description: 'Xoá thông tin mẫu phóng xạ thành công',
      type: 'success',
    });
    const res = yield call(layDSMauPhongXa, 1);
    yield put({
      type: settingTypes.LAY_MAU_PHONG_XA_SUCCESS,
      payload: {
        data: res.data,
        current_page: res.current_page,
        last_page: res.last_page,
      },
    });
  } catch (error) {
    networkHandler(error);
  } finally {
    CBNative.hide();
  }
}

export function* xoaMauPhongXaWatcher() {
  yield takeLatest(settingTypes.XOA_MAU_PHONG_XA, xoaMauPhongXaWorker);
}

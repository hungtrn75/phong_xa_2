import NetInfo from '@react-native-community/netinfo';
import {all, call, delay, put, select, takeLatest} from 'redux-saga/effects';
import {insertQuery, selectQuery} from '../../database/sqlite';
import {goBack} from '../../navigator/helper';
import {AuthService, LayerService} from '../../service';
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
    yield put({
      type: sharedTypes.FETCHING,
    });
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
    console.log('helper', error, {...error});
    yield put({
      type: settingTypes.GET_FORM_FIELD_SUCCESS,
      payload: null,
    });
  } finally {
    yield put({
      type: sharedTypes.DONE,
    });
  }
}

export function* getFormFieldWatcher() {
  yield takeLatest(settingTypes.GET_FORM_FIELD, getFormFieldWorker);
}

function* createLayerWorker(action) {
  try {
    yield put({
      type: sharedTypes.FETCHING,
    });
    const [isConnected, userId] = yield select(state => [
      state.offline.isConnected,
      state.auth.profile.id,
    ]);
    const {onXoaHanhDongThemMoi, edit, ...rest} = action.payload;
    if (isConnected) {
      let res;
      if (edit?.featureId) {
        yield call(LayerService.updateLayer, rest, edit.featureId);
      } else yield call(LayerService.createLayer, rest);

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

      if (edit?.layerId) {
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
      yield call(onXoaHanhDongThemMoi);
    } else {
      const rDrafts = [
        {
          json: JSON.stringify({...rest, edit}),
          error: '',
          status: 1,
        },
      ];
      yield call(insertQuery, [], rDrafts, 'tbl_drafts');
      const {insertId, rows} = yield call(
        selectQuery,
        'SELECT * FROM tbl_drafts',
        [],
      );

      let drafts = [];
      for (let i = 0; i < rows.length; i++) {
        var item = rows.item(i);
        drafts.push({
          ...item,
          json: JSON.parse(item.json),
        });
      }

      yield put({
        type: settingTypes.FETCH_DRAFTS_SUCCESS,
        payload: drafts,
      });

      yield call(action.payload.onXoaHanhDongThemMoi);
      pushMessage({
        message: 'Dữ liệu của bạn sẽ được đồng bộ sau khi kết nối lại internet',
        type: 'success',
      });
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
    yield put({
      type: sharedTypes.DONE,
    });
  }
}

export function* createLayerWatcher() {
  yield takeLatest(settingTypes.CREATE_LAYER, createLayerWorker);
}

function* deleteLayerWorker(action) {
  try {
    yield put({
      type: sharedTypes.FETCHING,
    });

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
  } catch (error) {
    console.log('helper', error, {...error});
  } finally {
    yield put({
      type: sharedTypes.DONE,
    });
  }
}

export function* deleteLayerWatcher() {
  yield takeLatest(settingTypes.DELETE_LAYER, deleteLayerWorker);
}

function* updateBookmarkWorker(action) {
  try {
    yield put({
      type: sharedTypes.FETCHING,
    });
    const {callback, ...rest} = action.payload;
    const res = yield call(LayerService.updateBookmark, rest);
    const bookmarks = yield call(LayerService.getBookmarks);
    yield put({
      type: settingTypes.GET_BOOKMARKS_SUCCESS,
      payload: bookmarks,
    });
    callback();
  } catch (error) {
    console.log('helper', error, {...error});
  } finally {
    yield put({
      type: sharedTypes.DONE,
    });
  }
}

export function* updateBookmarkWatcher() {
  yield takeLatest(settingTypes.UPDATE_BOOKMARK, updateBookmarkWorker);
}

function* createBookmarkWorker(action) {
  try {
    yield put({
      type: sharedTypes.FETCHING,
    });
    const {callback, ...rest} = action.payload;
    const res = yield call(LayerService.createBookmark, rest);
    const bookmarks = yield call(LayerService.getBookmarks);
    yield put({
      type: settingTypes.GET_BOOKMARKS_SUCCESS,
      payload: bookmarks,
    });
    callback();
  } catch (error) {
    console.log('helper', error, {...error});
  } finally {
    yield put({
      type: sharedTypes.DONE,
    });
  }
}

export function* createBookmarkWatcher() {
  yield takeLatest(settingTypes.CREATE_BOOKMARK, createBookmarkWorker);
}

function* deleteBookmarkWorker(action) {
  try {
    yield put({
      type: sharedTypes.FETCHING,
    });
    const res = yield call(LayerService.deleteBookmark, action.payload);
    const bookmarks = yield call(LayerService.getBookmarks);
    yield put({
      type: settingTypes.GET_BOOKMARKS_SUCCESS,
      payload: bookmarks,
    });
    console.log(res);
  } catch (error) {
    console.log('helper', error, {...error});
  } finally {
    yield put({
      type: sharedTypes.DONE,
    });
  }
}

export function* deleteBookmarkWatcher() {
  yield takeLatest(settingTypes.DELETE_BOOKMARK, deleteBookmarkWorker);
}

function* refreshDataWorker(action) {
  try {
    const {isConnected} = yield call(NetInfo.fetch);
    action?.payload();

    yield delay(1500);
    if (isConnected) {
      yield put({
        type: sharedTypes.FETCHING,
      });

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
      // const resMe = yield call(querryStore, 'resMe');
      // const drafs = yield call(querryAllDraft, resMe.id);
      // yield put({
      //   type: settingTypes.FETCH_DRAFTS_SUCCESS,
      //   payload: {drafs, isConnected: false},
      // });
    }
  } catch (error) {
    console.log('helper', error, {...error});
  } finally {
    yield put({
      type: sharedTypes.DONE,
    });
  }
}

export function* refreshDataWatcher() {
  yield takeLatest(settingTypes.REFRESH_DATA, refreshDataWorker);
}

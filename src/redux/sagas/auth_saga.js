import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {BASE_URL, resetEndpoint} from '../../constants';
import {insertQuery, selectQuery} from '../../database/sqlite';
import {goBack, replace} from '../../navigator/helper';
import {AuthService, LayerService} from '../../service';
import CBNative from '../../utils/CBNative';
import {networkHandler} from '../../utils/ErrorHandler';
import {pushMessage} from '../../utils/flash_message';
import AppStorage from '../../utils/storage';
import {settingTypes} from '../state/setting_redux';
import {authTypes} from './../state/auth_redux';

function* loginWorker(action) {
  try {
    CBNative.show();
    const {isInternetReachable} = yield call(NetInfo.fetch);
    if (isInternetReachable) {
      const userData = action.payload;
      const resLogin = yield call(AuthService.login, userData);
      yield call(AppStorage.setToken, resLogin.access_token);
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
      replace('TAB');
    } else {
      replace('AUTH_CONTAINER');
    }
  } catch (error) {
    networkHandler(error, 'Đăng nhập thất bại vui lòng thử lại sau');
  } finally {
    CBNative.hide();
  }
}

export function* loginWatcher() {
  yield takeLatest(authTypes.REQUEST_LOGIN_PENDING, loginWorker);
}

function* logoutWorker(action) {
  try {
    yield call(AppStorage.removeToken);
    replace('AUTH_CONTAINER');
  } catch (error) {
    console.log('auth', error);
  }
}

export function* logoutWatcher() {
  yield takeLatest(authTypes.REQUEST_LOGOUT, logoutWorker);
}

function* updateProfileWorker(action) {
  try {
    CBNative.show();
    yield call(AuthService.updateProfile, action.payload);
    const resMe = yield call(AuthService.me);
    yield put({
      type: authTypes.REQUEST_LOGIN_SUCCESS,
      payload: resMe,
    });
  } catch (error) {
    console.log('auth', error);
  } finally {
    CBNative.hide();
  }
}

export function* updateProfileWatcher() {
  yield takeLatest(authTypes.UPDATE_ME, updateProfileWorker);
}

function* changeAvatarWorker(action) {
  try {
    CBNative.show();
    yield call(AuthService.changeAvatar, action.payload);
    const resMe = yield call(AuthService.me);
    yield put({
      type: authTypes.REQUEST_LOGIN_SUCCESS,
      payload: resMe,
    });
  } catch (error) {
    console.log('auth', error, {...error});
  } finally {
    CBNative.hide();
  }
}

export function* changeAvatarWatcher() {
  yield takeLatest(authTypes.CHANGE_AVATAR, changeAvatarWorker);
}

//@ts-ignore
function* getMeWorker() {
  try {
    const baseUrl = yield call(AppStorage.getVal, 'base_url');
    if (baseUrl) {
      yield call(resetEndpoint, baseUrl);
    } else {
      axios.defaults.baseURL = BASE_URL;
    }
    const token = yield call(AppStorage.getToken);
    const {isConnected} = yield call(NetInfo.fetch);

    // ** \\
    let pendingFeatures = [],
      features = [],
      layers = [];
    const {rows: rPendingFeatures} = yield call(
      selectQuery,
      'SELECT * FROM tbl_pending_features',
      [],
    );
    const {rows: rFeatures} = yield call(
      selectQuery,
      'SELECT * FROM tbl_features',
      [],
    );
    const {rows: rLayers} = yield call(
      selectQuery,
      'SELECT * FROM tbl_layers',
      [],
    );

    if (rFeatures.length && rLayers.length) {
      for (let i = 0; i < rPendingFeatures.length; i++) {
        var item = rPendingFeatures.item(i);
        pendingFeatures.push(JSON.parse(item.json));
      }

      for (let i = 0; i < rFeatures.length; i++) {
        var item = rFeatures.item(i);
        features.push(JSON.parse(item.json));
      }

      for (let i = 0; i < rLayers.length; i++) {
        var item = rLayers.item(i);
        layers.push(JSON.parse(item.json));
      }
    } else {
      if (isConnected)
        [pendingFeatures, {layers, features}] = yield all([
          call(LayerService.getPendingFeatures),
          call(LayerService.getDoneFeatures),
        ]);
    }

    const {rows: rDrafts} = yield call(
      selectQuery,
      'SELECT * FROM tbl_drafts',
      [],
    );

    let drafts = [];
    for (let i = 0; i < rDrafts.length; i++) {
      var item = rDrafts.item(i);
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

    if (isConnected) {
      if (!token) {
        replace('AUTH_CONTAINER');
      } else {
        const [resMe, bookmarks] = yield all([
          call(AuthService.me),
          call(LayerService.getBookmarks),
        ]);
        yield put({
          type: authTypes.REQUEST_LOGIN_SUCCESS,
          payload: resMe,
        });
        yield put({
          type: settingTypes.GET_BOOKMARKS_SUCCESS,
          payload: bookmarks,
        });
        replace('TAB');
      }
    } else {
      const resMeStr = yield call(AppStorage.getVal, 'resMe');
      if (resMeStr) {
        yield put({
          type: authTypes.REQUEST_LOGIN_SUCCESS,
          payload: JSON.parse(resMeStr),
        });
        replace('TAB');
      } else {
        replace('AUTH_CONTAINER');
      }
      replace('AUTH_CONTAINER');
    }
  } catch (error) {
    console.log('auth', error, {...error});
    replace('AUTH_CONTAINER');
  }
}

export function* getMeWatcher() {
  yield takeLatest(authTypes.FETCH_ME, getMeWorker);
}

function* changePasswordWorker(action) {
  try {
    CBNative.show();
    const userId = yield select(state => state.auth.profile.id);
    yield call(AuthService.changePassword, userId, action.payload);

    pushMessage({
      message: 'Thay đổi mật khẩu thành công',
      type: 'success',
    });
    goBack();
  } catch (error) {
    console.log('auth', error);
    const message =
      error.response?.data.message ?? 'Đăng nhập thất bại vui lòng thử lại sau';
    if (message)
      showMessage({
        message,
        type: 'danger',
        icon: {
          position: 'center',
          icon: 'danger',
        },
      });
  } finally {
    CBNative.hide();
  }
}

export function* changePasswordWatcher() {
  yield takeLatest(authTypes.CHANGE_PASSWORD, changePasswordWorker);
}

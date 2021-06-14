// @ts-nocheck
import NetInfo from '@react-native-community/netinfo';
import {all, call, put, takeLatest} from 'redux-saga/effects';
import {
  deleteWithIdsQuery,
  insertQuery,
  selectQuery,
} from '../../database/sqlite';
import {LayerService} from '../../service';
import {updateLayer} from '../../service/layer';
import {pushMessage} from '../../utils/flash_message';
import {offlineTypes} from '../state/offline_redux';
import {settingTypes} from '../state/setting_redux';
import {sharedTypes} from '../state/share_redux';

function* changeInternetStatusWorker(action) {
  if (action.payload != null) {
    try {
      yield put({
        type: offlineTypes.CHANGE_INTERNET_STATUS_SUCCESS,
        payload: action.payload,
      });

      // if (action.payload) {
      //   yield put({
      //     type: offlineTypes.SYNC_DATA,
      //   });
      // }
    } catch (error) {
      console.log('offline', error);
    }
  }
}

export function* changeInternetStatusWatcher() {
  yield takeLatest(
    offlineTypes.CHANGE_INTERNET_STATUS,
    changeInternetStatusWorker,
  );
}

function* deleteDraftWorker(action) {
  try {
    yield call(deleteWithIdsQuery, [action.payload], 'tbl_drafts');
    let nDrafts = [];
    const {rows: rDraftsAfter} = yield call(
      selectQuery,
      'SELECT * FROM tbl_drafts',
    );

    for (let i = 0; i < rDraftsAfter.length; i++) {
      let rItem = rDraftsAfter.item(i);
      nDrafts.push({...rItem, json: JSON.parse(rItem.json)});
    }

    yield put({
      type: settingTypes.FETCH_DRAFTS_SUCCESS,
      payload: nDrafts,
    });
  } catch (error) {
    console.log('auth', error);
  }
}

export function* deleteDraftWatcher() {
  yield takeLatest(offlineTypes.DELETE_DRAFT, deleteDraftWorker);
}

function* syncDataWorker(action) {
  try {
    const {isConnected} = yield call(NetInfo.fetch);
    if (isConnected) {
      const {rows: rDrafts} = yield call(
        selectQuery,
        'SELECT * FROM tbl_drafts',
      );
      if (rDrafts.length) {
        let uDrafts = [];
        let dDrafts = [];

        yield put({
          type: sharedTypes.FETCHING,
        });
        yield put({
          type: offlineTypes.CHANGE_SYNC_STATUS,
          payload: true,
        });
        for (let i = 0; i < rDrafts.length; i++) {
          let rItem = rDrafts.item(i);
          let {edit, ...rest} = JSON.parse(rItem.json);
          try {
            if (edit?.featureId) {
              yield call(updateLayer, rest, edit.featureId);
            } else {
              yield call(LayerService.createLayer, rest);
            }
            dDrafts.push(rItem.id);
          } catch (error) {
            let errorStr =
              error.response?.data.message ?? 'Không rõ nguyên nhân';
            uDrafts.push({
              ...rItem,
              error: errorStr,
              status: 3,
            });
          }
        }
        if (dDrafts.length)
          yield call(deleteWithIdsQuery, dDrafts, 'tbl_drafts');
        if (uDrafts.length) yield call(insertQuery, [], uDrafts, 'tbl_drafts');

        let nDrafts = [];
        const {rows: rDraftsAfter} = yield call(
          selectQuery,
          'SELECT * FROM tbl_drafts',
        );

        for (let i = 0; i < rDraftsAfter.length; i++) {
          let rItem = rDraftsAfter.item(i);
          nDrafts.push(rItem);
        }
        yield put({
          type: settingTypes.FETCH_DRAFTS_SUCCESS,
          payload: nDrafts,
        });
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
          message: 'Dữ liệu offline đã được đồng bộ',
          type: 'success',
        });
        yield put({
          type: offlineTypes.CHANGE_SYNC_STATUS,
          payload: false,
        });
        yield put({
          type: sharedTypes.DONE,
        });
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put({
      type: offlineTypes.CHANGE_SYNC_STATUS,
      payload: false,
    });
    yield put({
      type: sharedTypes.DONE,
    });
  }
}

export function* syncDataWatcher() {
  yield takeLatest(offlineTypes.SYNC_DATA, syncDataWorker);
}

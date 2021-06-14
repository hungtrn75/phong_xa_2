import {createAction, handleActions} from 'redux-actions';
import {settingTypes} from './setting_redux';

export const offlineTypes = {
  CREATE_DRAFT: '@OFFLINE/CREATE_DRAFT',
  DELETE_DRAFT: '@OFFLINE/DELETE_DRAFT',
  CHANGE_INTERNET_STATUS: '@OFFLINE/CHANGE_INTERNET_STATUS',
  CHANGE_INTERNET_STATUS_SUCCESS: '@OFFLINE/CHANGE_INTERNET_STATUS_SUCCESS',
  CHANGE_SYNC_STATUS: '@OFFLINE/CHANGE_SYNC_STATUS',
  SYNC_DATA: '@OFFLINE/SYNC_DATA',
};

const createDraft = createAction(offlineTypes.CREATE_DRAFT);
const deleteDraft = createAction(offlineTypes.DELETE_DRAFT);
const changeInternetStatus = createAction(offlineTypes.CHANGE_INTERNET_STATUS);
const syncOffline = createAction(offlineTypes.SYNC_DATA);

export const offlineActions = {
  createDraft,
  deleteDraft,
  changeInternetStatus,
  syncOffline,
};

const initialState = {
  qs: [],
  isConnected: true,
  isSync: false,
};

export const offlineReducers = handleActions(
  {
    [settingTypes.FETCH_DRAFTS_SUCCESS]: (state, action) => ({
      ...state,
      qs: action.payload,
    }),
    [offlineTypes.CHANGE_SYNC_STATUS]: (state, action) => ({
      ...state,
      isSync: action.payload,
    }),
    [offlineTypes.CHANGE_INTERNET_STATUS_SUCCESS]: (state, action) => {
      state.isConnected =
        action.payload !== state.isConnected
          ? action.payload
          : state.isConnected;

      return state;
    },
  },
  initialState,
);

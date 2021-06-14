import {sharedReducers} from './state/share_redux';
import {combineReducers} from 'redux';
import rootSaga from './sagas';
import configureStore from './store';
import {authReducers} from './state/auth_redux';
import {settingReducers} from './state/setting_redux';
import {offlineReducers} from './state/offline_redux';

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
  auth: authReducers,
  settings: settingReducers,
  share: sharedReducers,
  offline: offlineReducers,
});

const creatStore = () => {
  let finalReducers = reducers;
  // If rehydration is on use persistReducer otherwise default combineReducers
  let {store, sagasManager, sagaMiddleware} = configureStore(
    finalReducers,
    rootSaga,
  );
  // @ts-ignore
  if (module.hot) {
    // @ts-ignore
    module.hot.accept(() => {
      const newYieldedSagas = require('./sagas').default;
      sagasManager.cancel();
      // @ts-ignore
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware.run(newYieldedSagas);
      });
    });
  }

  return store;
};

const store = creatStore();

export default store;

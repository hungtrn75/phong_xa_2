import {applyMiddleware, compose, createStore, Store, AnyAction} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {AuthState} from './state/auth_redux';
import {ShareState} from './state/share_redux';
import {SettingState} from './state/setting_redux';
import {OfflineState} from './state/offline_redux';
import {Platform} from 'react-native';

// creates the store
export default (rootReducer, rootSaga) => {
  /* ------------- Redux Configuration ------------- */

  const middleware = [];
  const enhancers = [];

  /* ------------- Saga Middleware ------------- */

  const sagaMiddleware = createSagaMiddleware();
  middleware.push(sagaMiddleware);

  /* ------------- Redux Logger ------------- */

  if (__DEV__ && Platform.OS == 'ios')
    middleware.push(require('redux-logger').logger);

  /* ------------- Assemble Middleware ------------- */

  enhancers.push(applyMiddleware(...middleware));

  const store = createStore(rootReducer, compose(...enhancers));

  // kick off root saga
  let sagasManager = sagaMiddleware.run(rootSaga);

  return {
    store,
    sagasManager,
    sagaMiddleware,
  };
};

import {all, fork} from 'redux-saga/effects';
/* ------------- Sagas ------------- */
import * as authSagas from './auth_saga';
import * as helperSagas from './helper_saga';
import * as offlineSagas from './offline_saga';

/* ------------- Connect Types To Sagas ------------- */

export default function* rootSaga() {
  yield all([...Object.values(authSagas)].map(fork));
  yield all([...Object.values(helperSagas)].map(fork));
  yield all([...Object.values(offlineSagas)].map(fork));
}

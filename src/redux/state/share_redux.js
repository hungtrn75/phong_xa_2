import {createAction, handleActions} from 'redux-actions';
import {authTypes} from './auth_redux';
import {Appearance, ColorSchemeName} from 'react-native';

export const sharedTypes = {
  FETCHING: '@SHARE/FETCHING',
  DONE: '@SHARE/DONE',
  TOGGLE_SCHEME: '@SHARE/TOGGLE_SCHEME',
  SET_SCHEME: '@SHARE/SET_SCHEME',
};

const onFetching = createAction(sharedTypes.FETCHING);
const onDone = createAction(sharedTypes.DONE);
const toggleScheme = createAction(sharedTypes.TOGGLE_SCHEME);

export const shareActions = {
  onFetching,
  onDone,
  toggleScheme,
};

const initialState = {
  isFetching: false,
  colorScheme: 'light',
  // colorScheme: Appearance.getColorScheme(),
};

export const sharedReducers = handleActions(
  {
    [sharedTypes.FETCHING]: (state, action) => ({
      ...state,
      isFetching: true,
    }),
    [sharedTypes.DONE]: state => ({
      ...state,
      isFetching: false,
    }),
    [sharedTypes.TOGGLE_SCHEME]: state => ({
      ...state,
      colorScheme: state.colorScheme === 'dark' ? 'light' : 'dark',
    }),
    [sharedTypes.SET_SCHEME]: (state, action) => ({
      ...state,
      colorScheme: action.payload,
    }),
  },
  initialState,
);

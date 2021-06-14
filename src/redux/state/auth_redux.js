import {createAction, handleActions} from 'redux-actions';

export const authTypes = {
  REQUEST_LOGIN_PENDING: '@AUTH/REQUEST_LOGIN_PENDING',
  REQUEST_LOGIN_SUCCESS: '@AUTH/REQUEST_LOGIN_SUCCESS',
  REQUEST_LOGOUT: '@AUTH/REQUEST_LOGOUT',
  FETCH_ME: '@AUTH/FETCH_ME',
  UPDATE_ME: '@AUTH/UPDATE_ME',
  CHANGE_PASSWORD: '@AUTH/CHANGE_PASSWORD',
  CHANGE_AVATAR: '@AUTH/CHANGE_AVATAR',
};

const requestLogin = createAction(authTypes.REQUEST_LOGIN_PENDING);
const loginSuccess = createAction(authTypes.REQUEST_LOGIN_SUCCESS);
const requestLogout = createAction(authTypes.REQUEST_LOGOUT);
const fetchMe = createAction(authTypes.FETCH_ME);
const updateProfile = createAction(authTypes.UPDATE_ME);
const changePassword = createAction(authTypes.CHANGE_PASSWORD);
const changeAvatar = createAction(authTypes.CHANGE_AVATAR);

export const authSelectors = {};

export const authActions = {
  requestLogin,
  loginSuccess,
  requestLogout,
  fetchMe,
  updateProfile,
  changePassword,
  changeAvatar,
};

const initialState = {
  profile: undefined,
  isAuth: false,
};

export const authReducers = handleActions(
  {
    [authTypes.REQUEST_LOGIN_SUCCESS]: (state, action) => ({
      ...state,
      profile: action.payload,
      isAuth: true,
    }),

    [authTypes.REQUEST_LOGOUT]: () => ({
      ...initialState,
    }),
  },
  initialState,
);

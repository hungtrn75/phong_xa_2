import {featureCollection, geometry} from '@turf/helpers';
import {feature, centerOfMass, polygon} from '@turf/turf';
import {flatten} from 'lodash';
import {createAction, handleActions} from 'redux-actions';
import * as yup from 'yup';
import {getByLevel} from '../../utils/helper';
import {authTypes} from './auth_redux';
import moment from 'moment';

export const settingTypes = {
  GET_CHU_GIAI: '@SETTING/GET_CHU_GIAI',
  GET_CHU_GIAI_SUCCESS: '@SETTING/GET_CHU_GIAI_SUCCESS',
  GET_FORM_FIELD: '@SETTING/GET_FORM_FIELD',
  GET_FORM_FIELD_SUCCESS: '@SETTING/GET_FORM_FIELD_SUCCESS',
  CREATE_LAYER: '@SETTING/CREATE_LAYER',
  CREATE_LAYER_SUCCESS: '@SETTING/CREATE_LAYER_SUCCESS',
  DELETE_LAYER: '@SETTING/DELETE_LAYER',
  GET_MASTER_DATA_SUCCESS: '@SETTING/GET_MASTER_DATA_SUCCESS',
  GET_FORMS_SUCCESS: '@SETTING/GET_FORMS_SUCCESS',
  GET_FEATURES_SUCCESS: '@SETTING/GET_FEATURES_SUCCESS',
  GET_SUBMITTED_FORM: '@SETTING/GET_SUBMITTED_FORM',
  GET_SUBMITTED_FORM_SUCCESS: '@SETTING/GET_SUBMITTED_FORM_SUCCESS',
  GET_BOOKMARKS: '@SETTING/GET_BOOKMARKS',
  GET_BOOKMARKS_SUCCESS: '@SETTING/GET_BOOKMARKS_SUCCESS',
  CREATE_BOOKMARK: '@SETTING/CREATE_BOOKMARK',
  UPDATE_BOOKMARK: '@SETTING/UPDATE_BOOKMARK',
  DELETE_BOOKMARK: '@SETTING/DELETE_BOOKMARK',
  FETCH_DRAFTS: '@SETTING/FETCH_DRAFTS',
  FETCH_DRAFTS_SUCCESS: '@SETTING/FETCH_DRAFTS_SUCCESS',
  FETCH_PENDING_FEARTURES_SUCCESS: '@SETTING/FETCH_PENDING_FEARTURES_SUCCESS',
  REFRESH_DATA: '@SETTING/REFRESH_DATA',
};

const getFormField = createAction(settingTypes.GET_FORM_FIELD);
const createLayer = createAction(settingTypes.CREATE_LAYER);
const deleteLayer = createAction(settingTypes.DELETE_LAYER);
const getSubmittedForm = createAction(settingTypes.GET_SUBMITTED_FORM);
const taoMoiDanhDau = createAction(settingTypes.CREATE_BOOKMARK);
const chinhSuaDanhDau = createAction(settingTypes.UPDATE_BOOKMARK);
const xoaDanhDau = createAction(settingTypes.DELETE_BOOKMARK);
const fetchDrafts = createAction(settingTypes.FETCH_DRAFTS);
const refreshData = createAction(settingTypes.REFRESH_DATA);

export const settingsActions = {
  getFormField,
  createLayer,
  deleteLayer,
  getSubmittedForm,
  taoMoiDanhDau,
  chinhSuaDanhDau,
  xoaDanhDau,
  fetchDrafts,
  refreshData,
};

const initialState = {
  features: {
    type: 'FeatureCollection',
    features: [],
  },
  pendingCollection: {
    type: 'FeatureCollection',
    features: [],
  },
  draftCollection: {
    type: 'FeatureCollection',
    features: [],
  },
  chuGiais: [],
  layers: [],
  formFields: null,
  formikFields: null,
  schema: null,
  masterData: [],
  formSelect: [],
  forms: [],
  pendingFeatures: [],
  doneFeatures: [],
  level: 1,
  bookmarks: [],
  // colorScheme: Appearance.getColorScheme(),
};

export const settingReducers = handleActions(
  {
    [settingTypes.GET_CHU_GIAI_SUCCESS]: (state, action) => {
      let newLayers = [...action.payload].map(el => ({
        id: el.id,
        color: el.color,
        shape_type: el.shape_type,
        layer_type_id: el.layer_type_id,
        icon: el.icon,
      }));
      return {
        ...state,
        chuGiais: action.payload.filter(el => !el.parent_id),
        layers: newLayers,
      };
    },
    [settingTypes.GET_FORMS_SUCCESS]: (state, action) => ({
      ...state,
      forms: action.payload,
    }),
    [settingTypes.FETCH_DRAFTS_SUCCESS]: (state, action) => {
      let featuresMock = [];

      action.payload.map(el => {
        featuresMock = [
          ...featuresMock,
          feature(el.json.geometry, {
            ...el.mobile_form,
            draftId: el.id,
            layer_id: el.json.geometry.type === 'Point' ? -4 : -5,
          }),
        ];
      });

      const featureCollectionMock = featureCollection(featuresMock);
      return {
        ...state,
        draftCollection: featureCollectionMock,
      };
    },
    [settingTypes.FETCH_PENDING_FEARTURES_SUCCESS]: (state, action) => {
      const pendingFeatures = action.payload.filter(el => el.geometry);

      let featuresMock = [];

      pendingFeatures.map(el => {
        const {geometry, id, ...rest} = el;
        featuresMock = [
          ...featuresMock,
          feature(el.geometry, {
            ...el.mobile_form,
            pendingId: id,
            layer_id: geometry.type === 'Point' ? -2 : -3,
          }),
        ];
      });

      const featureCollectionMock = featureCollection(featuresMock);
      return {
        ...state,
        pendingFeatures,
        pendingCollection: featureCollectionMock,
      };
    },
    [settingTypes.GET_FEATURES_SUCCESS]: (state, action) => {
      const {layers, features} = action.payload;
      const layerObject = layers.reduce(
        (acc, el) => ({...acc, [el.id]: el}),
        {},
      );
      let featuresMock = [];
      features.map(el => {
        el.layer_ids.map(it => {
          if (layerObject[it]) {
            if (layerObject[it].shape_type === 'POLYGONE') {
              featuresMock = [
                ...featuresMock,
                feature(el.geometry, {
                  layer_id: it,
                  color: layerObject[it].color,
                  shape_type: 'POLYGONE',
                }),
              ];
            }
            if (layerObject[it].shape_type === 'POINT') {
              featuresMock = [
                ...featuresMock,
                feature(el.geometry, {
                  layer_id: it,
                  color: layerObject[it].color,
                }),
              ];
            }
          }
        });
      });
      const featureCollectionMock = featureCollection(featuresMock);
      return {
        ...state,
        features: featureCollectionMock,
        layers,
        doneFeatures: features,
      };
    },
    [settingTypes.CREATE_LAYER_SUCCESS]: (state, action) => {
      const {pendingFeatures, features} = action.payload;
      return {
        ...state,
        features,
        pendingFeatures,
      };
    },
    [settingTypes.GET_MASTER_DATA_SUCCESS]: (state, action) => ({
      ...state,
      masterData: action.payload,
    }),
    [settingTypes.GET_BOOKMARKS_SUCCESS]: (state, action) => ({
      ...state,
      bookmarks: action.payload,
    }),
    [authTypes.REQUEST_LOGOUT]: (state, action) => ({
      ...initialState,
    }),
  },
  initialState,
);

import {useActionSheet} from '@expo/react-native-action-sheet';
//@ts-nocheck
import MapboxGL from '@react-native-mapbox-gl/maps';
import {area, length, lineString, polygon} from '@turf/turf';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Alert} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {useTiming} from 'react-native-redash';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {offlineActions} from '../../redux/state/offline_redux';
import {settingsActions} from '../../redux/state/setting_redux';
import {ShareStyles} from '../../theme';
import {requestLocationPermisstionsAndroid} from '../../utils/permission';
import BanDoNen from './components/ban_do_nen';
import DanhDau, {DanhSachDanhDau} from './components/danh_dau';
import DoiTuongChuaDuyet from './components/doi_tuong_chua_duyet';
import DoDac from './components/do_dac';
import DuLieuOffline from './components/du_lieu_offline';
import LeftTools from './components/left_tools';
import Lop from './components/lop';
import MapPack from './components/map_pack';
import MapRenderer from './components/map_render';
import MauPhongXa from './components/mau_phong_xa/MauPhongXa';
import OfflinePacks from './components/offline_packs';
import RightTools from './components/right_tools';
import ThemMoiDoiTuong from './components/them_moi_doi_tuong';
import ViTri from './components/vi_tri';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiaHV1bmdoaXBoYW0iLCJhIjoiY2pseXg2ZTl0MXRkdDN2b2J5bzFpbmlhZSJ9.cChkzU6jLVXx4v75qo_dfQ',
);

const initPack = {
  name: '',
  offlineRegion: null,
  offlineRegionStatus: null,
  visible: false,
};

const initVisible = {
  actionShow: false,
  mapTileShow: false,
  mapOfflineShow: false,
  objectShow: false,
  visibleCaculate: false,
  visibleChuGiai: false,
  pendingFeatureShow: false,
  offlineFeature: false,
  mauPhongXa: false,
};

const initVisible2 = {
  themMoi: false,
  thuNho: false,
  ve: false,
};

const initDanhDau = {
  visible: false,
  name: '',
  image: null,
  isEdit: false,
};

const mobileForms = [
  {
    id: 1,
    name: 'Dạng vùng',
    layer: {
      shape_type: 'POLYGONE',
    },
  },
  {
    id: 2,
    name: 'Dạng điểm',
    layer: {
      shape_type: 'POINT',
    },
  },
];

const Map = ({
  navigation,
  chuGiais,
  forms,
  offlineData,
  layers,
  featureCollectionMock,
  pendingFeatures,
  taoMoiDanhDau,
  chinhSuaDanhDau,
  xoaDanhDau,
  bookmarks,
  refreshData,
  syncOffline,
  deleteLayer,
  dCollection,
  pCollection,
  deleteOffline,
  mauPhongXas,
}) => {
  const {showActionSheetWithOptions} = useActionSheet();
  //Refs
  const camera = useRef(null);
  const map = useRef(null);
  let [annotations, setAnnitation] = useState({
    coordinates: [],
    activeIndex: null,
  });
  let [mapPack, setMapPack] = useState(initPack);

  let [packs, setPacks] = useState([]);
  //Draw tools
  let [layer, setLayer] = useState({
    type: 'FeatureCollection',
    features: [],
  });
  let [mode, setMode] = useState();
  let value = useRef(0);
  let valueArea = useRef(null);
  let toggle = useRef(false);
  let spaceRef = useRef(null);
  let [unitLine, setUnitLine] = useState('Mét');
  let [unitArea, setUnitArea] = useState('Mét vuông');
  let [lopDoiTuong, setLopDoituong] = useState([]);
  //
  let [mapAction, setMapAction] = useState(true); ///asdjasjdias
  let [visible, setVisible] = useState(initVisible);
  let [visible2, setVisible2] = useState(initVisible2);
  let [danhDau, setDanhDau] = useState({...initDanhDau});
  let [activeTitle, setActiveTile] = useState(0);
  let [prevObjects, setPrevObjects] = useState([]);
  let [currentLoc, setcurrentLoc] = useState({
    lat: '',
    lon: '',
  });

  const memoPx = useRef(null);
  let [showPosition, setshowPosition] = useState(false);
  let [whiteList, setWhiteList] = useState([]);
  let location = useRef(null);

  useEffect(() => {
    setPrevObjects(layers.map(el => ({...el, checked: false})));
  }, [layers]);

  useEffect(() => {
    if (!mode) setshowPosition(true);
    else setshowPosition(false);
  }, [mode]);

  const onLocationUpdate = React.useCallback(loc => {
    location.current = loc;
  }, []);

  const onSelectAction = action => () => {
    if (visible.hasOwnProperty(action)) {
      spaceRef.current = visible[action] ? null : action;
      setVisible({
        ...initVisible,
        [action]: !visible[action],
      });
    }
  };
  const onMapRendered = () => {
    setMapAction(true);
  };

  const transition = useTiming(mapAction, {duration: 400});

  //MAP OFFLINE
  useEffect(() => {
    // if (!__DEV__)
    //   Alert.alert(
    //     'Chú ý',
    //     'Nếu khu vực không có kết nối mạng. Vui lòng tải dữ liệu bản đồ thực địa trước khi đến khảo sát!',
    //   );
    requestLocationPermisstionsAndroid();
    getPacks();
  }, []);

  const getPacks = async () => {
    const offlinePacks = await MapboxGL.offlineManager.getPacks();
    if (offlinePacks?.length >= 0) {
      setPacks([...offlinePacks]);
    }
  };

  const toggleLop =
    ({item, index}) =>
    () => {
      prevObjects[index].checked = !prevObjects[index].checked;
      prevObjects = [...prevObjects];
      if (!prevObjects[index].checked) {
        whiteList = whiteList.filter(el => el !== item.id);
      } else {
        whiteList = [...whiteList, item.id];
      }
      setWhiteList([...whiteList]);
    };
  //GETTERS
  const getLineString = anno => ({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates:
            mode == 'line'
              ? anno.coordinates
              : [...anno.coordinates, anno.coordinates[0]],
        },
      },
    ],
  });

  const renderCollection = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: [
        ...featureCollectionMock.features.filter(el => {
          if (
            whiteList.includes(el.properties.layer_id) ||
            [-2, -3].includes(el.properties.layer_id)
          )
            return true;
          return false;
        }),
      ],
    }),
    [featureCollectionMock, whiteList],
  );
  // MAP ACTIONS
  const _onMapPress = ({geometry: {coordinates: coor}}) => {
    currentLoc = {
      lat: coor[1].toFixed(4) + '',
      lon: coor[0].toFixed(4) + '',
    };
    if (annotations.activeIndex !== null) {
      annotations.coordinates[annotations.activeIndex] = coor;
      const lineFeature = getLineString(annotations);
      annotations = {...annotations, activeIndex: null};
      setLayer({...lineFeature});
    } else if (mode) {
      if (mode === 'point') {
        annotations.coordinates[0] = coor;
      } else annotations.coordinates.push(coor);
      const lineFeature = getLineString(annotations);

      if (annotations.coordinates.length > 1) {
        if (mode == 'line') {
          let line = lineString(annotations.coordinates);
          let size = length(line, {units: 'meters'});
          value.current = size;
        } else {
          if (annotations.coordinates.length > 2) {
            const areaPolys = polygon([
              [...annotations.coordinates, annotations.coordinates[0]],
            ]);
            //In m2

            const areaC = area(areaPolys);
            value.current = areaC;
          }
        }
        // layer = {...lineFeature};
        setLayer({...lineFeature});
      }
      setAnnitation({...annotations});
    } else {
      setcurrentLoc(currentLoc);
    }
  };

  const navigateToPending = item => () => {
    camera.current?.setCamera({
      centerCoordinate: item.center_point.coordinates,
      zoomLevel: 16,
      animationDuration: 1000,
    });
  };

  //UTILITIES

  const chinhSuaLop = item => () => {
    spaceRef.current = null;
    setVisible({...initVisible});
    if (item.geometry.type === 'Polygon') {
      setMode('polygon');
      const newCoor = [...item.geometry.coordinates[0]];
      newCoor.pop();
      const newLayer = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [...item.geometry.coordinates[0]],
            },
          },
        ],
      };
      valueArea.current = {
        layerId: 2,
        featureId: item.id,
        item,
      };
      setAnnitation({
        coordinates: newCoor,
        activeIndex: null,
      });

      setLopDoituong([mobileForms[0]]);
      setLayer(newLayer);
      setVisible2({
        themMoi: true,
        thuNho: false,
        ve: true,
      });
    }
    if (item.geometry.type === 'Point') {
      setMode('point');
      valueArea.current = {
        layerId: 1,
        featureId: item.id,
        item,
      };
      setAnnitation({
        coordinates: [[...item.geometry.coordinates]],
        activeIndex: null,
      });
      setVisible2({
        themMoi: true,
        thuNho: false,
        ve: true,
      });
      setLopDoituong([mobileForms[1]]);
    }
  };

  const resetLayer = () => {
    setAnnitation({
      coordinates: [],
      activeIndex: null,
    });
    setLayer({
      type: 'FeatureCollection',
      features: [],
    });
    valueArea.current = null;
  };

  const onDeleteDraw = () => {
    value.current = 0;
    resetLayer();
    setMode(null);
  };

  const onSaveLayer = () => {
    let geometry;

    if (mode === 'point') {
      if (annotations.coordinates.length === 0)
        return showMessage({
          description: 'Bạn chưa chọn điểm',
          message: 'Lớp đối tượng dạng điểm',
          type: 'danger',
        });
      geometry = {
        type: 'Point',
        coordinates: annotations.coordinates[0],
      };
    }
    if (mode === 'polygon') {
      if (
        layer.features.length === 0 ||
        (layer.features.length &&
          layer.features[0].geometry.coordinates.length < 4)
      ) {
        console.log(true);

        return showMessage({
          description: 'Bạn chưa vẽ vùng',
          message: 'Lớp đối tượng dạng vùng',
          type: 'danger',
        });
      } else {
        geometry = {...layer.features[0].geometry};
        geometry.type = 'Polygon';
      }
    }

    if (lopDoiTuong.length) {
      navigation.navigate('ADD_PLACE', {
        formValues: {
          layer: lopDoiTuong[0],
          geometry,
          onXoaHanhDongThemMoi,
          edit: valueArea.current,
          type: 1,
        },
      });
    }

    setVisible2({
      ...visible2,
      thuNho: true,
    });
  };

  const onXoaHanhDongThemMoi = () => {
    setVisible2({...initVisible2});
    if (lopDoiTuong.length) setLopDoituong([]);
    onDeleteDraw();
  };

  const _taoMoiDanhDau = async () => {
    const zoom = map.current ? await map.current.getZoom() : 14;
    const center = map.current ? await map.current.getCenter() : [102, 21];
    const hide = () => {
      setDanhDau({...initDanhDau});
    };
    if (danhDau.isEdit) {
      chinhSuaDanhDau({
        id: +danhDau.isEdit,
        longtitude: center[0],
        latitude: center[1],
        zoom: Math.round(zoom),
        name: danhDau.name,
        image: danhDau.image,
        callback: hide,
      });
    } else {
      taoMoiDanhDau({
        longtitude: center[0],
        latitude: center[1],
        zoom: Math.round(zoom),
        name: danhDau.name,
        image: danhDau.image,
        callback: hide,
      });
    }
  };

  const refresh = () => {
    toggle.current = false;
    if (camera.current) {
      camera.current.setCamera({
        centerCoordinate: [106.934828, 16.035012],
        zoomLevel: 5,
        animationDuration: 0,
      });
    }
    valueArea.current = null;
    spaceRef.current = null;
    setVisible({...initVisible});
    setVisible2({...initVisible2});
    setDanhDau({...initDanhDau});
    setPrevObjects(chuGiais.map(el => ({...el, checked: true})));
    onDeleteDraw();
  };

  const refreshDataController = () => {
    refreshData(refresh);
  };

  return (
    <SafeAreaView style={[ShareStyles.safeArea]}>
      <MapRenderer
        activeTitle={activeTitle}
        annotations={annotations}
        baseMap={baseMap}
        layer={layer}
        layers={layers}
        mode={mode}
        renderCollection={renderCollection}
        pendingCollection={pCollection}
        draftCollection={dCollection}
        onMapPress={_onMapPress}
        onMapRendered={onMapRendered}
        setAnnitation={setAnnitation}
        setshowPosition={setshowPosition}
        onLocationUpdate={onLocationUpdate}
        showPosition={showPosition}
        location={currentLoc}
        ref={{camera, map}}
        mauPhongXas={mauPhongXas}
      />
      <LeftTools
        camera={camera}
        map={map}
        spaceRef={spaceRef}
        location={location}
      />
      <RightTools
        transition={transition}
        visible={visible}
        onSelectAction={onSelectAction}
        setVisible2={setVisible2}
        initVisible2={initVisible2}
        visible2={visible2}
        refreshData={refreshDataController}
        mode={mode}
      />
      <ViTri
        loc={currentLoc}
        setLoc={setcurrentLoc}
        camera={camera}
        showLocation={showPosition}
        setshowPosition={setshowPosition}
        spaceRef={spaceRef}
        memoPx={memoPx}
      />
      <DoDac
        show={visible.visibleCaculate}
        setVisible={setVisible}
        visible={visible}
        value={value}
        setLayer={setLayer}
        mode={mode}
        setMode={setMode}
        unitArea={unitArea}
        setUnitArea={setUnitArea}
        unitLine={unitLine}
        setUnitLine={setUnitLine}
        onDeleteDraw={onDeleteDraw}
        initLayer={initLayer}
      />
      <BanDoNen
        visible={visible.mapTileShow}
        activeTitle={activeTitle}
        setActiveTile={setActiveTile}
        baseMap={baseMap}
        onSelectAction={onSelectAction}
      />
      {/* <ChuGiai
        visible={visible.visibleChuGiai}
        chuGiais={chuGiais}
        onSelectAction={onSelectAction}
      /> */}
      <DanhSachDanhDau
        show={visible.actionShow}
        bookmarks={bookmarks}
        setDanhDau={setDanhDau}
        onSelectAction={onSelectAction}
        camera={camera}
        xoaDanhDau={xoaDanhDau}
        map={map}
      />
      <OfflinePacks
        show={visible.mapOfflineShow}
        packs={packs}
        mapPack={mapPack}
        onSelectAction={onSelectAction}
        setMapPack={setMapPack}
        map={map}
        camera={camera}
        initPack={initPack}
        getPacks={getPacks}
      />
      <Lop
        visible={visible.objectShow}
        setWhiteList={setWhiteList}
        setPrevObjects={setPrevObjects}
        layers={layers}
        prevObjects={prevObjects}
        onSelectAction={onSelectAction}
        toggleLop={toggleLop}
        toggle={toggle}
      />

      <ThemMoiDoiTuong
        visible={visible2.themMoi}
        setVisible={setVisible}
        setVisible2={setVisible2}
        setAnnitation={setAnnitation}
        setLayer={setLayer}
        setLopDoituong={setLopDoituong}
        setMode={setMode}
        forms={mobileForms}
        initLayer={initLayer}
        initVisible={initVisible}
        lopDoiTuong={lopDoiTuong}
        mode={mode}
        onSaveLayer={onSaveLayer}
        onXoaHanhDongThemMoi={onXoaHanhDongThemMoi}
        spaceRef={spaceRef}
        value={value}
        visible2={visible2}
      />
      {/* PENDING */}
      <DoiTuongChuaDuyet
        visible={visible.pendingFeatureShow}
        pendingFeatures={pendingFeatures}
        onSelectAction={onSelectAction}
        chinhSuaLop={chinhSuaLop}
        navigateToPending={navigateToPending}
        deleteLayer={deleteLayer}
      />
      {/* OFFLINE FORM */}
      <MauPhongXa
        camera={camera}
        visible={visible.mauPhongXa}
        onSelectAction={onSelectAction}
        setLoc={setcurrentLoc}
        memoPx={memoPx}
        location={currentLoc}
      />
      <DuLieuOffline
        visible={visible.offlineFeature}
        syncOffline={syncOffline}
        camera={camera}
        offlineData={offlineData}
        onSelectAction={onSelectAction}
        deleteDraft={deleteOffline}
      />

      <DanhDau
        visible={danhDau.visible}
        setDanhDau={setDanhDau}
        taoMoiDanhDau={_taoMoiDanhDau}
        danhDau={danhDau}
      />

      <MapPack
        visible={mapPack.visible}
        mapPack={mapPack}
        getPacks={getPacks}
        setMapPack={setMapPack}
      />
    </SafeAreaView>
  );
};

const mapStateToProps = state => ({
  colorScheme: state.share.colorScheme,
  forms: state.settings.forms,
  layers: state.settings.layers,
  chuGiais: state.settings.chuGiais,
  pendingFeatures: state.settings.pendingFeatures,
  featureCollectionMock: state.settings.features,
  pCollection: state.settings.pendingCollection,
  dCollection: state.settings.draftCollection,
  bookmarks: state.settings.bookmarks,
  offlineData: state.offline.qs,
  mauPhongXas: state.settings.mauPhongXas.data,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      taoMoiDanhDau: settingsActions.taoMoiDanhDau,
      chinhSuaDanhDau: settingsActions.chinhSuaDanhDau,
      xoaDanhDau: settingsActions.xoaDanhDau,
      refreshData: settingsActions.refreshData,
      deleteLayer: settingsActions.deleteLayer,
      syncOffline: offlineActions.syncOffline,
      deleteOffline: offlineActions.deleteDraft,
      changeInternetStatus: offlineActions.changeInternetStatus,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Map);

const baseMap = [
  {
    title: 'Hình ảnh',
    type: 'raster',
    thumbnail: require('../../assets/images/satellite.png'),
    link: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
  {
    title: 'Đường phố',
    type: 'vector',
    thumbnail: require('../../assets/images/streets.png'),
  },
];

const initLayer = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [0, 0],
        ],
      },
      numberZero: 2,
    },
  ],
};

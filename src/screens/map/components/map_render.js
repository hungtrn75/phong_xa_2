//@ts-nocheck
import MapboxGL from '@react-native-mapbox-gl/maps';
import * as turf from '@turf/turf';
import React, {useCallback, useMemo, useState} from 'react';
import isEqual from 'react-fast-compare';
import {RELEASE_ENDPOINT} from '../../../constants';
import colors from '../../../theme/colors';
import {isValidCoordinate} from '../../../utils/helper';
import styles from '../map.styles';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiaHV1bmdoaXBoYW0iLCJhIjoiY2pseXg2ZTl0MXRkdDN2b2J5bzFpbmlhZSJ9.cChkzU6jLVXx4v75qo_dfQ',
);

const MapRenderer = React.forwardRef(
  (
    {
      activeTitle,
      annotations,
      baseMap,
      layer,
      layers,
      mode,
      renderCollection,
      onMapPress,
      onMapRendered,
      onLocationUpdate,
      showPosition,
      location,
      draftCollection,
      pendingCollection,
      mauPhongXas,
    },
    ref,
  ) => {
    const {map, camera} = ref;
    const renderTile1 = () => (
      <MapboxGL.RasterSource
        id="rasterSource"
        tileUrlTemplates={[
          'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        ]}
        tileSize={256}>
        <MapboxGL.RasterLayer
          id="rasterLayer"
          sourceLayerID="rasterSource"
          style={{rasterOpacity: 1}}
          layerIndex={110}
        />
      </MapboxGL.RasterSource>
    );

    // console.log(JSON.stringify(renderCollection));
    // console.log(layers);
    const mapboxImages = useMemo(() => {
      let images = {};
      layers.map(el => {
        if (el.meta?.icon) {
          images[el.meta.icon] = {uri: `${RELEASE_ENDPOINT}${el.meta.icon}`};
        }
      });
      return images;
    }, [layers]);

    const locationShape = useMemo(() => {
      if (showPosition && isValidCoordinate(+location.lon, +location.lat)) {
        const point = turf.point([+location.lon, +location.lat]);
        return point;
      }

      const collection = [];
      annotations.coordinates.map(el => {
        const pItem = turf.point(el);
        collection.push(pItem);
      });

      return turf.featureCollection(collection);
    }, [annotations, location, showPosition]);

    const pxShape = useMemo(() => {
      const collection = [];
      mauPhongXas.map(el => {
        collection.push(turf.point([+el.longitude, +el.latitude]));
      });
      return turf.featureCollection(collection);
    }, [mauPhongXas]);

    const renderLayer = useCallback(() => {
      return layers.map((el, id) => {
        switch (el.shape_type) {
          case 'POLYGONE':
            return (
              <MapboxGL.Animated.FillLayer
                id={`polygon_${id}`}
                key={`polygon_${id}`}
                style={{
                  fillColor: 'blue',
                  fillOpacity: 0.2,
                }}
                filter={['==', 'layer_id', el.id]}
              />
            );
          case 'POINT':
            if (el.color)
              return (
                <MapboxGL.CircleLayer
                  id={`centerpoint_${id}`}
                  filter={['all', ['==', 'layer_id', el.id]]}
                  key={`centerpoint_${id}`}
                  style={{...mapboxStyles.c1, circleColor: el.color}}
                />
              );
            if (el?.meta?.icon) {
              return (
                <MapboxGL.SymbolLayer
                  id={`point_${id}`}
                  layerIndex={120}
                  key={`point_${id}`}
                  filter={['==', 'layer_id', el.id]}
                  style={mapboxStyles.s1}
                />
              );
            }
            return (
              <MapboxGL.CircleLayer
                id={`no_asset_point_${id}`}
                filter={['all', ['==', 'layer_id', el.id]]}
                key={`no_asset_point_${id}`}
                style={mapboxStyles.c2}
              />
            );
          default:
            return (
              <MapboxGL.SymbolLayer
                id={`point_${id}`}
                layerIndex={1}
                key={`point_${id}`}
                filter={['==', 'layer_id', -1]}
                style={mapboxStyles.s2}
              />
            );
        }
      });
    }, [layers]);

    return (
      <MapboxGL.MapView
        ref={map}
        style={styles.map}
        pitchEnabled={false}
        styleURL={'http://molietsi.imagetrekk.com/static/vietnam-vector.json'}
        logoEnabled={false}
        attributionEnabled={false}
        onPress={onMapPress}
        userTrackingMode={MapboxGL.UserTrackingModes.Follow}
        onDidFinishRenderingFrameFully={onMapRendered}>
        <MapboxGL.UserLocation
          visible={true}
          animated
          onUpdate={onLocationUpdate}
        />
        <MapboxGL.Camera
          ref={camera}
          zoomLevel={initCamera.zoomLevel}
          animationMode="flyTo"
          followUserLocation={false}
          centerCoordinate={initCamera.centerCoordinate}
        />
        {baseMap[activeTitle].type === 'raster' ? renderTile1() : null}
        <MapboxGL.Images images={mapboxImages} />
        <MapboxGL.ShapeSource
          id="featureCollection"
          shouldRasterizeIOS
          hitbox={{width: 20, height: 20}}
          shape={renderCollection}>
          {renderLayer()}
        </MapboxGL.ShapeSource>
        <MapboxGL.ShapeSource
          id="pendingFeatureCollection"
          shouldRasterizeIOS
          hitbox={{width: 20, height: 20}}
          shape={pendingCollection}>
          <MapboxGL.CircleLayer
            key={`null_point`}
            id={`null_point`}
            filter={['==', 'layer_id', -2]}
            style={mapboxStyles.circlePendingLayer}
          />
          <MapboxGL.FillLayer
            id={`polygon_pending`}
            key={`polygon_pending`}
            style={mapboxStyles.fillPendingLayer}
            filter={['==', 'layer_id', -3]}
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.ShapeSource
          id="draftFeatureCollection"
          shouldRasterizeIOS
          hitbox={{width: 20, height: 20}}
          shape={draftCollection}>
          <MapboxGL.CircleLayer
            key={`null_point_2`}
            id={`null_point_2`}
            filter={['==', 'layer_id', -4]}
            style={mapboxStyles.circlePendingLayer}
          />
          <MapboxGL.FillLayer
            id={`polygon_pending_2`}
            key={`polygon_pending_2`}
            style={mapboxStyles.fillDraftLayer}
            filter={['==', 'layer_id', -5]}
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.ShapeSource
          id="mauPhongXaSource"
          shouldRasterizeIOS
          hitbox={{width: 20, height: 20}}
          shape={pxShape}>
          <MapboxGL.CircleLayer
            key={`mauPhongXaLayer`}
            id={`mauPhongXaLayer`}
            style={mapboxStyles.circlePXLayer}
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.ShapeSource id="shapeSourceTools" shape={layer}>
          {mode === 'polygon' ? (
            <MapboxGL.FillLayer
              id={'polygon'}
              style={fillStyle}
              aboveLayerID="line"
              belowLayerID="current_loc"
            />
          ) : null}
          <MapboxGL.LineLayer
            id={'line'}
            style={lineStyle}
            sourceLayerID="shapeSourceTools"
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.ShapeSource id="anotation_shape" shape={locationShape}>
          <MapboxGL.CircleLayer id="curr_loc" style={mapboxStyles.annotation} />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>
    );
  },
);

export default React.memo(MapRenderer, isEqual);

const lineStyle = {
  lineCap: 'round',
  lineWidth: 2,
  lineOpacity: 0.8,
  lineColor: colors.BUTTON,
};
const fillStyle = {
  fillColor: colors.BUTTON,
  fillOpacity: 0.4,
};

const initCamera = {
  centerCoordinate: [106.934828, 16.035012],
  zoomLevel: 5,
  animationDuration: 1000,
};

const mapboxStyles = {
  c1: {
    circleOpacity: 1.0,
    circleRadius: 5.0,
    circleStrokeColor: colors.WHITE,
    circleStrokeWidth: 1,
  },
  c2: {
    circleColor: 'blue',
    circleOpacity: 1.0,
    circleRadius: 5.0,
    circleStrokeColor: colors.WHITE,
    circleStrokeWidth: 1,
  },
  circlePXLayer: {
    circleOpacity: 0.7,
    circleColor: colors.SECONDARY,
    circleRadius: 6.0,
    circleStrokeColor: 'white',
    circleStrokeWidth: 2,
  },
  circlePendingLayer: {
    circleOpacity: 0.7,
    circleColor: 'red',
    circleRadius: 6.0,
    circleStrokeColor: 'white',
    circleStrokeWidth: 2,
  },
  fillPendingLayer: {
    fillColor: 'red',
    fillOpacity: 0.7,
  },

  circleDraftLayer: {
    circleOpacity: 0.7,
    circleColor: 'blue',
    circleRadius: 6.0,
    circleStrokeColor: 'white',
    circleStrokeWidth: 2,
  },
  fillDraftLayer: {
    fillColor: 'blue',
    fillOpacity: 0.7,
  },
  annotation: {
    circleColor: 'orange',
    circleStrokeColor: 'white',
    circleStrokeWidth: 2,
  },
  s1: {
    iconImage: ['get', 'icon'],
    iconAllowOverlap: false,
    iconSize: 0.2,
  },
  s2: {
    iconImage: ['get', 'icon'],
    iconAllowOverlap: false,
    iconSize: 0.2,
  },
};

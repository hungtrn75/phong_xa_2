//@ts-nocheck
import MapboxGL from '@react-native-mapbox-gl/maps';
import React from 'react';
import isEqual from 'react-fast-compare';
import {RELEASE_ENDPOINT} from '../../../constants';
import colors from '../../../theme/colors';
import {isValidCoordinate} from '../../../utils/helper';
import styles from '../map.styles';
import tileJson from './vietnam';

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
      setAnnitation,
      showPosition,
      location,
      setshowPosition,
      draftCollection,
      pendingCollection,
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
          layerIndex={85}
        />
      </MapboxGL.RasterSource>
    );

    const renderTile2 = () => (
      <>
        <MapboxGL.VectorSource
          id="vietnam"
          tileUrlTemplates={[
            'http://titles.ceid.gov.vn/vietnam_ocean_vt/{z}/{x}/{y}.pbf',
          ]}>
          {tileJson.layers
            .filter(el =>
              ['line', 'fill', 'background', 'symbol'].includes(el.type),
            )
            .map(el => {
              if (el.type === 'background') {
                return (
                  <MapboxGL.BackgroundLayer
                    id={el.id}
                    key={el.id}
                    layerIndex={85}
                    style={{
                      visibility: 'visible',
                      backgroundColor: el.paint['background-color'],
                    }}
                  />
                );
              }
              if (el.type === 'line')
                return (
                  <MapboxGL.LineLayer
                    id={el.id}
                    key={el.id}
                    sourceID={el.source}
                    // filter={el.filter}
                    // layerIndex={30}
                    sourceLayerID={el['source-layer']}
                    maxZoomLevel={el.maxzoom ? el.maxzoom : 20}
                    minZoomLevel={el.minzoom ? el.minzoom : 0}
                    style={{
                      lineColor: el.paint['line-color']['stops']
                        ? el.paint['line-color']['stops'][0][1]
                        : el.paint['line-color'],
                      // lineWidth: el.paint['line-width']
                      //   ? el.paint['line-width']['base']
                      //   : 1.2,
                    }}
                  />
                );
              if (el.type == 'symbol') {
                return (
                  <MapboxGL.SymbolLayer
                    key={el.id}
                    id={el.id}
                    sourceID={el.source}
                    // filter={el.filter}
                    // layerIndex={100}
                    sourceLayerID={el['source-layer']}
                    maxZoomLevel={el.maxzoom ? el.maxzoom : 20}
                    minZoomLevel={el.minzoom ? el.minzoom : 0}
                    style={{
                      // textColor: el.paint['text-color'],
                      // textHaloColor: el.paint['text-halo-color'],
                      textHaloBlur: 0.5,
                      textHaloColor: '#ffffff',
                      textField: '{name}',
                      textFont: el.paint['text-font'] ?? [
                        'Open Sans Regular',
                        'Arial Unicode MS Regular',
                      ],
                      textSize: el.paint['text-size']
                        ? el.paint['text-size']
                        : 12,
                      visibility: 'visible',
                      iconImage: '{subclass}_15',
                    }}
                  />
                );
              }
              return (
                <MapboxGL.FillLayer
                  key={el.id}
                  id={el.id}
                  sourceID={el.source}
                  filter={el.filter}
                  sourceLayerID={el['source-layer']}
                  maxZoomLevel={el.maxzoom ? el.maxzoom : 20}
                  minZoomLevel={el.minzoom ? el.minzoom : 0}
                  style={{
                    fillColor: el.paint['fill-color']['stops']
                      ? el.paint['fill-color']['stops'][0][1]
                      : el.paint['fill-color'],
                  }}
                />
              );
            })}
        </MapboxGL.VectorSource>
      </>
    );

    return (
      <MapboxGL.MapView
        ref={map}
        style={styles.map}
        pitchEnabled={false}
        styleURL={MapboxGL.StyleURL.Light}
        logoEnabled={false}
        onPress={onMapPress}
        userTrackingMode={MapboxGL.UserTrackingModes.Follow}
        // onRegionDidChange={async () => {
        //   const zoom = await map?.current.getZoom();
        //   console.log(zoom);
        // }}

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
          maxZoomLevel={16}
          centerCoordinate={initCamera.centerCoordinate}
        />
        {baseMap[activeTitle].type === 'raster' ? renderTile1() : renderTile2()}

        <MapboxGL.Animated.ShapeSource id="shapeSourceTools" shape={layer}>
          {mode === 'polygon' ? (
            <MapboxGL.Animated.FillLayer
              id={'polygon'}
              style={fillStyle}
              aboveLayerID="line"
              belowLayerID="current_loc"
              layerIndex={89}
            />
          ) : null}
          <MapboxGL.Animated.LineLayer
            id={'line'}
            style={lineStyle}
            layerIndex={89}
            sourceLayerID="shapeSourceTools"
          />
        </MapboxGL.Animated.ShapeSource>
        <MapboxGL.ShapeSource
          id="featureCollection"
          shouldRasterizeIOS
          hitbox={{width: 20, height: 20}}
          shape={renderCollection}>
          {layers.map((el, id) => {
            switch (el.shape_type) {
              case 'POLYGONE':
                return (
                  <MapboxGL.Animated.FillLayer
                    id={`polygon_${id}`}
                    key={`polygon_${id}`}
                    layerIndex={86}
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
                      layerIndex={89}
                      style={{
                        circleColor: el.color,
                        circleOpacity: 1.0,
                        circleRadius: 5.0,
                        circleStrokeColor: colors.BLACK,
                        circleStrokeWidth: 1,
                      }}
                    />
                  );
                if (el?.meta?.icon)
                  return (
                    <MapboxGL.SymbolLayer
                      id={`point_${id}`}
                      key={`point_${id}`}
                      layerIndex={89}
                      filter={['==', 'layer_id', el.id]}
                      style={{
                        iconImage: `${RELEASE_ENDPOINT}${el.meta.icon}`,
                        iconAllowOverlap: false,
                        iconSize: 0.3,
                      }}
                    />
                  );

                <MapboxGL.CircleLayer
                  key={`null_${id}`}
                  id={`null_${id}`}
                  filter={['==', 'null', el.id]}
                />;

              default:
                return (
                  <MapboxGL.SymbolLayer
                    id={`point_${id}`}
                    layerIndex={1}
                    key={`point_${id}`}
                    filter={['==', 'layer_id', -1]}
                    style={{
                      iconImage: `${RELEASE_ENDPOINT}${el.icon}`,
                      iconAllowOverlap: false,
                    }}
                  />
                );
            }
          })}
          {/* <MapboxGL.Animated.LineLayer
            id={'symbolPolygonaLine'}
            layerIndex={101}
            filter={['==', 'shape_type', 'POLYGONE']}
            style={{
              lineCap: 'round',
              lineWidth: 1,
              lineOpacity: 0.4,
              lineColor: colors.BLACK,
            }}
          /> */}
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
            layerIndex={90}
            style={{
              circleOpacity: 0.7,
              circleColor: 'red',
              circleRadius: 6.0,
              circleStrokeColor: 'white',
              circleStrokeWidth: 2,
            }}
          />
          <MapboxGL.FillLayer
            id={`polygon_pending`}
            key={`polygon_pending`}
            layerIndex={91}
            style={{
              fillColor: 'red',
              fillOpacity: 0.7,
            }}
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
            layerIndex={90}
            style={{
              circleOpacity: 0.7,
              circleColor: 'blue',
              circleRadius: 6.0,
              circleStrokeColor: 'white',
              circleStrokeWidth: 2,
            }}
          />
          <MapboxGL.FillLayer
            id={`polygon_pending_2`}
            key={`polygon_pending_2`}
            layerIndex={91}
            style={{
              fillColor: 'blue',
              fillOpacity: 0.7,
            }}
            filter={['==', 'layer_id', -5]}
          />
        </MapboxGL.ShapeSource>
        {annotations.coordinates.map((el, index) => (
          <MapboxGL.PointAnnotation
            id={`point_annotation${index}`}
            key={`point_annotation${index}`}
            // selected={index === annotations.activeIndex}
            onSelected={() => {
              setAnnitation({
                ...annotations,
                activeIndex: index,
              });
            }}
            coordinate={el}
          />
        ))}
        {showPosition && isValidCoordinate(location.lon, +location.lat) && (
          <MapboxGL.PointAnnotation
            id={`current_loc`}
            key={`current_loc`}
            onSelected={() => {
              setshowPosition(false);
              onMapPress({
                geometry: {coordinates: [+location.lon, +location.lat]},
              });
            }}
            coordinate={[+location.lon, +location.lat]}
          />
        )}
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

import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../theme/colors';
import DropdownItem from '../../../widgets/map/dropdown_item';
import styles from '../map.styles';

const RightTools = ({
  transition,
  visible,
  onSelectAction,
  setVisible2,
  initVisible2,
  visible2,
  refreshData,
  mode,
}) => {
  const aniStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            transition.value,
            [0, 1],
            [200, 0],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  }, [transition]);
  return (
    <Animated.View style={[styles.dropdown, aniStyle]}>
      <DropdownItem
        iconName="view-grid"
        isActive={visible.mapTileShow}
        onPress={onSelectAction('mapTileShow')}
        tooltip="Thay đổi bản đồ nền"
      />
      <DropdownItem
        iconName="bookmark"
        isActive={visible.actionShow}
        onPress={onSelectAction('actionShow')}
        tooltip="Đánh dấu vị trí"
      />
      <View>
        <DropdownItem
          iconName="ruler-square-compass"
          isActive={visible.visibleCaculate}
          onPress={onSelectAction('visibleCaculate')}
          tooltip="Công cụ đo đạc trên bản đồ"
        />
      </View>

      {/* <DropdownItem
        iconName="format-list-bulleted-type"
        isActive={visible.visibleChuGiai}
        onPress={onSelectAction('visibleChuGiai')}
        tooltip="Chú giải về các đối tượng trên bản đồ"
      /> */}
      <DropdownItem
        iconName="layers"
        isActive={visible.objectShow}
        onPress={onSelectAction('objectShow')}
        tooltip="Thông tin về các lớp trên bản đồ"
      />
      <DropdownItem
        iconName="cloud-download"
        isActive={visible.mapOfflineShow}
        onPress={onSelectAction('mapOfflineShow')}
        tooltip="Dữ liệu offline của từng vùng bản đồ"
      />
      <DropdownItem
        iconName="file-document"
        isActive={visible.offlineFeature}
        onPress={onSelectAction('offlineFeature')}
        tooltip="Biểu mẫu được lưu trữ khi không có kết nối mạng"
      />
      <DropdownItem
        iconName="lan-pending"
        isActive={visible.pendingFeatureShow}
        onPress={onSelectAction('pendingFeatureShow')}
        tooltip="Danh sách các đối tượng chưa được phê duyệt"
      />

      <View>
        <DropdownItem
          iconName={'plus-box'}
          tooltip="Thêm mới đối tượng"
          isActive={false}
          onPress={() =>
            setVisible2({
              ...initVisible2,
              themMoi: true,
            })
          }
        />
        {visible2.thuNho ? (
          <TouchableOpacity
            onPress={() =>
              setVisible2({
                ...visible2,
                themMoi: true,
                thuNho: false,
              })
            }
            style={styles.v15}>
            <Icon
              name={mode === 'polygon' ? 'shape-polygon-plus' : 'circle-medium'}
              size={26}
              color={colors.WHITE}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      <DropdownItem
        iconName="sync"
        tooltip="Làm mới dữ liệu ứng dụng"
        isActive={false}
        onPress={() => {
          refreshData();
        }}
      />
    </Animated.View>
  );
};

export default RightTools;

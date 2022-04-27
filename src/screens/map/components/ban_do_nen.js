import CheckBox from "@react-native-community/checkbox";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "../../../theme";
import colors from "../../../theme/colors";
import Block from "../../../widgets/base/block";
import styles from "../map.styles";
import { RELEASE_ENDPOINT } from "../../../constants";

const BanDoNen = ({
                    activeTitle,
                    setActiveTile,
                    baseMap,
                    visible,
                    onSelectAction,
                    banDoNens,
                  }) => {
  const renderMapTile = ({ item, index }) => {
    const checked = activeTitle?.id === item.id;
    return (
      <Block
        row
        key={"title" + index}
        style={styles.itemBasemap}
        onPress={() => {
          setActiveTile(item);
        }}>
        <View
          style={{
            borderWidth: 2,
            borderColor: checked ? Colors.PRIMARY : Colors.WHITE,
            padding: 5,
            borderRadius: 4,
          }}>
          <Image
            style={[styles.thumbnail]}
            resizeMode="cover"
            source={{ uri: `${RELEASE_ENDPOINT}${item.thumbnail}` }}
          />
        </View>
        <Text
          style={[
            styles.txt,
            {
              color: checked ? colors.PRIMARY : colors.BLACK,
            },
          ]}>
          {item.title}
        </Text>
        <View style={{ flex: 1 }} />
        <CheckBox
          value={checked}
          disabled={true}
          onTintColor={Colors.PRIMARY}
          onCheckColor={Colors.PRIMARY}
          animationDuration={0.2}
          style={styles.mapTile1}
        />
      </Block>
    );
  };

  if (!visible) return null;
  return (
    <View style={[styles.mapTile]}>
      <View style={[styles.wrapTitle, styles.v8]}>
        <Icon name="view-grid" size={24} color={colors.WHITE} />
        <Text style={styles.title}>Bản đồ nền</Text>
        <TouchableOpacity onPress={onSelectAction("mapTileShow")}>
          <Icon name="chevron-left" size={28} color={colors.WHITE} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={baseMap}
        contentContainerStyle={styles.fl}
        keyExtractor={(item, index) => "title" + index}
        renderItem={renderMapTile}
        ListEmptyComponent={
          <Block center>
            <Text style={styles.nodata}>Chưa có dữ liệu</Text>
          </Block>
        }
      />
    </View>
  );
};

export default BanDoNen;

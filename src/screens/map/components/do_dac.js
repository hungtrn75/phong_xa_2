import {useActionSheet} from '@expo/react-native-action-sheet';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../../theme';
import colors from '../../../theme/colors';
import {formatCurrency} from '../../../utils/helper';
import Block from '../../../widgets/base/block';
import styles from '../map.styles';

const DoDac = ({
  show = false,
  visible,
  value,
  mode,
  setLayer,
  setVisible,
  setMode,
  setUnitArea,
  setUnitLine,
  initLayer,
  unitArea,
  unitLine,
  onDeleteDraw,
}) => {
  const {showActionSheetWithOptions} = useActionSheet();

  const getString = (value, unit) => {
    switch (unit) {
      case 'Mét vuông':
        return `${formatCurrency(value.toFixed(0))} m2`;
      case 'Héc-ta':
        return `${formatCurrency((value * 0.0001).toFixed(0))} ha`;
      case 'Kilômét vuông':
        return `${formatCurrency((value * 1e-6).toFixed(0))} km2`;
      case 'Mét':
        return `${formatCurrency(value.toFixed(0))} m`;
      case 'Kilômét':
        return `${formatCurrency((value * 0.001).toFixed(0))} km`;
      default:
        return ``;
    }
  };
  if (!show) return null;
  return (
    <View style={styles.q}>
      <Block row center space="between" style={styles.w}>
        <Text style={styles.t1}>Công cụ đo đạc</Text>
        <TouchableOpacity
          onPress={() => {
            onDeleteDraw();
            setVisible({
              ...visible,
              visibleCaculate: false,
            });
          }}>
          <Icon name="close" size={24} color={colors.BORDER} />
        </TouchableOpacity>
      </Block>
      <Block style={styles.v2}>
        <Block row center>
          <Block
            onPress={() => {
              onDeleteDraw();
              setMode('line');
              if (mode) setLayer({...initLayer});
            }}
            middle
            center
            style={styles.v3}>
            <Icon size={26} name="ruler" color={colors.PRIMARY} />
          </Block>

          <Block
            onPress={() => {
              onDeleteDraw();
              setMode('polygon');
              if (mode) setLayer({...initLayer});
            }}
            middle
            center
            style={styles.v4}>
            <Icon size={26} name="math-compass" color={colors.PRIMARY} />
          </Block>

          <Block
            row
            center
            flex={1}
            space="between"
            style={styles.v5}
            onPress={() => {
              if (mode === 'polygon') {
                showActionSheetWithOptions(
                  {
                    options: ['Huỷ', 'Mét vuông', 'Héc-ta', 'Kilômét vuông'],
                    cancelButtonIndex: 0,
                  },
                  buttonIndex => {
                    if (buttonIndex === 0) {
                      // cancel action
                    } else if (buttonIndex === 1) {
                      setUnitArea('Mét vuông');
                    } else if (buttonIndex === 2) {
                      setUnitArea('Héc-ta');
                    } else if (buttonIndex === 3) {
                      setUnitArea('Kilômét vuông');
                    }
                  },
                );
              } else {
                showActionSheetWithOptions(
                  {
                    options: ['Huỷ', 'Mét', 'Kilômét'],
                    cancelButtonIndex: 0,
                  },
                  buttonIndex => {
                    if (buttonIndex === 0) {
                      // cancel action
                    } else if (buttonIndex === 1) {
                      setUnitLine('Mét');
                    } else if (buttonIndex === 2) {
                      setUnitLine('Kilômét');
                    }
                  },
                );
              }
            }}>
            <Text>{mode === 'polygon' ? unitArea : unitLine}</Text>
            <Icon name="chevron-down" size={20} color={Colors.BORDER} />
          </Block>
        </Block>
        <View style={styles.v6} />
        <Text style={styles.norTxt}>Kết quả đo lường</Text>
        <Block row center space="between">
          <Text style={styles.ltxt}>
            {mode === 'polygon'
              ? getString(value.current, unitArea)
              : getString(value.current, unitLine)}
          </Text>
          {mode ? (
            <TouchableOpacity onPress={onDeleteDraw}>
              <Icon name="delete" size={24} />
            </TouchableOpacity>
          ) : null}
        </Block>
      </Block>
    </View>
  );
};

export default DoDac;

import React from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';
import { ImageCrop } from '../game/types';

interface BlockCellProps {
  size: number;
  color: string;
  imageUri?: string;
  imageCrop?: ImageCrop;
  opacity?: number;
  style?: ViewStyle;
  inset?: number;
}

export function BlockCell({
  size,
  color,
  imageUri,
  imageCrop,
  opacity = 1,
  style,
  inset = 2,
}: BlockCellProps) {
  const innerSize = size - inset * 2;
  const cropRows = imageCrop?.rows ?? 1;
  const cropCols = imageCrop?.cols ?? 1;
  const cropRow = imageCrop?.row ?? 0;
  const cropCol = imageCrop?.col ?? 0;

  return (
    <View
      style={[
        styles.wrapper,
        {
          width: size,
          height: size,
          opacity,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.inner,
          {
            width: innerSize,
            height: innerSize,
            backgroundColor: imageUri ? '#1a1a2e' : color,
          },
        ]}
      >
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{
              width: innerSize * cropCols,
              height: innerSize * cropRows,
              position: 'absolute',
              left: -cropCol * innerSize,
              top: -cropRow * innerSize,
            }}
            resizeMode="cover"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    overflow: 'hidden',
  },
});
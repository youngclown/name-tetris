import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Piece } from '../game/types';
import { BlockCell } from './BlockCell';

interface DraggablePieceProps {
  piece: Piece;
  cellSize: number;
  customImageUri?: string | null;
  disabled?: boolean;
  onDragStart: (piece: Piece) => void;
  onDragMove: (piece: Piece, absoluteX: number, absoluteY: number) => void;
  onDragEnd: (piece: Piece, absoluteX: number, absoluteY: number) => void;
}

export function DraggablePiece({
  piece,
  cellSize,
  customImageUri,
  disabled = false,
  onDragStart,
  onDragMove,
  onDragEnd,
}: DraggablePieceProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const zIndex = useSharedValue(1);

  const shapeWidth = piece.shape[0].length * cellSize;
  const shapeHeight = piece.shape.length * cellSize;
  const shapeRows = piece.shape.length;
  const shapeCols = piece.shape[0].length;

  const pan = Gesture.Pan()
    .enabled(!disabled)
    .onBegin(() => {
      scale.value = withSpring(1.15);
      zIndex.value = 100;
      runOnJS(onDragStart)(piece);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      runOnJS(onDragMove)(piece, event.absoluteX, event.absoluteY);
    })
    .onEnd((event) => {
      runOnJS(onDragEnd)(piece, event.absoluteX, event.absoluteY);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
      zIndex.value = 1;
    })
    .onFinalize(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
      zIndex.value = 1;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: zIndex.value,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.container,
          { width: shapeWidth, height: shapeHeight },
          animatedStyle,
        ]}
      >
        {piece.shape.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, colIndex) =>
              cell === 1 ? (
                <BlockCell
                  key={`cell-${rowIndex}-${colIndex}`}
                  size={cellSize}
                  color={piece.color}
                  imageUri={customImageUri ?? undefined}
                  imageCrop={
                    customImageUri
                      ? {
                          row: rowIndex,
                          col: colIndex,
                          rows: shapeRows,
                          cols: shapeCols,
                        }
                      : undefined
                  }
                  inset={1}
                />
              ) : (
                <View
                  key={`empty-${rowIndex}-${colIndex}`}
                  style={{ width: cellSize, height: cellSize }}
                />
              ),
            )}
          </View>
        ))}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
  },
});
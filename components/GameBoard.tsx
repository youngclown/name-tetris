import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Board, CellData, GRID_SIZE, Piece, Shape } from '../game/types';
import { BlockCell } from './BlockCell';

interface GameBoardProps {
  board: Board;
  cellSize: number;
  customImageUri?: string | null;
  preview?: { piece: Piece; row: number; col: number; valid: boolean } | null;
  onLayout: (layout: { x: number; y: number; width: number; height: number }) => void;
}

function PreviewCells({
  shape,
  color,
  imageUri,
  row,
  col,
  cellSize,
  valid,
}: {
  shape: Shape;
  color: string;
  imageUri?: string | null;
  row: number;
  col: number;
  cellSize: number;
  valid: boolean;
}) {
  const cells: React.ReactNode[] = [];
  const shapeRows = shape.length;
  const shapeCols = shape[0].length;

  for (let r = 0; r < shapeRows; r += 1) {
    for (let c = 0; c < shape[r].length; c += 1) {
      if (shape[r][c] !== 1) continue;
      cells.push(
        <View
          key={`preview-${r}-${c}`}
          style={{
            position: 'absolute',
            left: (col + c) * cellSize,
            top: (row + r) * cellSize,
          }}
        >
          <BlockCell
            size={cellSize}
            color={valid ? color : '#FF4444'}
            imageUri={imageUri ?? undefined}
            imageCrop={
              imageUri
                ? { row: r, col: c, rows: shapeRows, cols: shapeCols }
                : undefined
            }
            opacity={valid ? 0.75 : 0.5}
          />
        </View>,
      );
    }
  }

  return <>{cells}</>;
}

function renderPlacedCell(cell: CellData, cellSize: number) {
  return (
    <BlockCell
      size={cellSize}
      color={cell.color}
      imageUri={cell.imageUri}
      imageCrop={cell.imageCrop}
    />
  );
}

export function GameBoard({
  board,
  cellSize,
  customImageUri,
  preview,
  onLayout,
}: GameBoardProps) {
  const boardSize = cellSize * GRID_SIZE;

  return (
    <View
      style={[styles.board, { width: boardSize, height: boardSize }]}
      onLayout={(event) => {
        event.target.measureInWindow((x, y, width, height) => {
          onLayout({ x, y, width, height });
        });
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <View
            key={`cell-${rowIndex}-${colIndex}`}
            style={[
              styles.cell,
              {
                width: cellSize,
                height: cellSize,
                left: colIndex * cellSize,
                top: rowIndex * cellSize,
              },
            ]}
          >
            {cell && renderPlacedCell(cell, cellSize)}
          </View>
        )),
      )}

      {preview && (
        <PreviewCells
          shape={preview.piece.shape}
          color={preview.piece.color}
          imageUri={customImageUri}
          row={preview.row}
          col={preview.col}
          cellSize={cellSize}
          valid={preview.valid}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#4A4A6A',
    position: 'relative',
    overflow: 'hidden',
  },
  cell: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
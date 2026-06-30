import { Piece, Shape } from './types';

export const BLOCK_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#FFE66D',
  '#A78BFA',
  '#F472B6',
  '#60A5FA',
  '#34D399',
  '#FB923C',
];

const SHAPES: Shape[] = [
  [[1]],
  [[1, 1]],
  [[1], [1]],
  [[1, 1, 1]],
  [[1], [1], [1]],
  [[1, 1], [1, 1]],
  [[1, 1, 1], [0, 1, 0]],
  [[1, 1, 1], [1, 0, 0]],
  [[1, 1, 1], [0, 0, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 1, 1, 1]],
  [[1, 0], [1, 0], [1, 1]],
  [[0, 1], [0, 1], [1, 1]],
  [[1, 1, 1], [0, 1, 0], [0, 1, 0]],
];

let pieceCounter = 0;

function randomColor(): string {
  return BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
}

function randomShape(): Shape {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}

export function createPiece(): Piece {
  pieceCounter += 1;
  return {
    id: `piece-${pieceCounter}`,
    shape: randomShape(),
    color: randomColor(),
  };
}

export function createTray(count = 3): Piece[] {
  return Array.from({ length: count }, () => createPiece());
}
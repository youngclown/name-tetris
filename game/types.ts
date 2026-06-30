export const GRID_SIZE = 8;

export interface ImageCrop {
  row: number;
  col: number;
  rows: number;
  cols: number;
}

export interface CellData {
  color: string;
  imageUri?: string;
  imageCrop?: ImageCrop;
}

export type Cell = CellData | null;

export type Board = Cell[][];

export type Shape = number[][];

export interface Piece {
  id: string;
  shape: Shape;
  color: string;
}

export interface ClearResult {
  board: Board;
  clearedLines: number;
  scoreGained: number;
}

export interface PlacementPreview {
  row: number;
  col: number;
  valid: boolean;
}
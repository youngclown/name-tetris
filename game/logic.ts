import { Board, ClearResult, GRID_SIZE, Piece, PlacementPreview, Shape } from './types';

export function createEmptyBoard(): Board {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null),
  );
}

export function canPlace(
  board: Board,
  shape: Shape,
  row: number,
  col: number,
): boolean {
  for (let r = 0; r < shape.length; r += 1) {
    for (let c = 0; c < shape[r].length; c += 1) {
      if (shape[r][c] !== 1) continue;

      const boardRow = row + r;
      const boardCol = col + c;

      if (
        boardRow < 0 ||
        boardCol < 0 ||
        boardRow >= GRID_SIZE ||
        boardCol >= GRID_SIZE
      ) {
        return false;
      }

      if (board[boardRow][boardCol] !== null) {
        return false;
      }
    }
  }

  return true;
}

export function placePiece(
  board: Board,
  shape: Shape,
  row: number,
  col: number,
  color: string,
  imageUri?: string,
): Board {
  const nextBoard = board.map((line) => [...line]);
  const shapeRows = shape.length;
  const shapeCols = shape[0].length;

  for (let r = 0; r < shapeRows; r += 1) {
    for (let c = 0; c < shape[r].length; c += 1) {
      if (shape[r][c] !== 1) continue;

      nextBoard[row + r][col + c] = {
        color,
        ...(imageUri
          ? {
              imageUri,
              imageCrop: { row: r, col: c, rows: shapeRows, cols: shapeCols },
            }
          : {}),
      };
    }
  }

  return nextBoard;
}

export function clearCompletedLines(board: Board): ClearResult {
  const rowsToClear = new Set<number>();
  const colsToClear = new Set<number>();

  for (let row = 0; row < GRID_SIZE; row += 1) {
    if (board[row].every((cell) => cell !== null)) {
      rowsToClear.add(row);
    }
  }

  for (let col = 0; col < GRID_SIZE; col += 1) {
    let full = true;
    for (let row = 0; row < GRID_SIZE; row += 1) {
      if (board[row][col] === null) {
        full = false;
        break;
      }
    }
    if (full) colsToClear.add(col);
  }

  const clearedLines = rowsToClear.size + colsToClear.size;
  if (clearedLines === 0) {
    return { board, clearedLines: 0, scoreGained: 0 };
  }

  const nextBoard = board.map((line) => [...line]);

  rowsToClear.forEach((row) => {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      nextBoard[row][col] = null;
    }
  });

  colsToClear.forEach((col) => {
    for (let row = 0; row < GRID_SIZE; row += 1) {
      nextBoard[row][col] = null;
    }
  });

  const scoreGained =
    clearedLines === 1
      ? 10
      : clearedLines === 2
        ? 30
        : clearedLines >= 3
          ? 60 + (clearedLines - 3) * 20
          : 0;

  return { board: nextBoard, clearedLines, scoreGained };
}

export function clearBottomRows(board: Board, rowCount: number): Board {
  const nextBoard = board.map((line) => [...line]);
  const startRow = GRID_SIZE - rowCount;

  for (let row = startRow; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      nextBoard[row][col] = null;
    }
  }

  return nextBoard;
}

export function canPieceFitAnywhere(board: Board, piece: Piece): boolean {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      if (canPlace(board, piece.shape, row, col)) {
        return true;
      }
    }
  }
  return false;
}

export function hasAnyValidMove(board: Board, pieces: Piece[]): boolean {
  return pieces.some((piece) => canPieceFitAnywhere(board, piece));
}

export function snapPlacement(
  board: Board,
  shape: Shape,
  row: number,
  col: number,
): PlacementPreview | null {
  const candidates: PlacementPreview[] = [];

  for (let r = row - 1; r <= row + 1; r += 1) {
    for (let c = col - 1; c <= col + 1; c += 1) {
      candidates.push({
        row: r,
        col: c,
        valid: canPlace(board, shape, r, c),
      });
    }
  }

  const valid = candidates.filter((candidate) => candidate.valid);
  if (valid.length === 0) return null;

  valid.sort((a, b) => {
    const distA = Math.abs(a.row - row) + Math.abs(a.col - col);
    const distB = Math.abs(b.row - row) + Math.abs(b.col - col);
    return distA - distB;
  });

  return valid[0];
}
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { usePlayerSettings } from '../context/PlayerSettingsContext';
import {
  canPlace,
  clearBottomRows,
  clearCompletedLines,
  createEmptyBoard,
  hasAnyValidMove,
  placePiece,
  snapPlacement,
} from '../game/logic';
import { createTray } from '../game/pieces';
import {
  CONTINUE_CLEAR_ROWS,
  getBadgeLabel,
  getContinueCheerMessage,
  getGameSubtitle,
  getGameTitle,
  getHintMessage,
  getLineClearMessage,
} from '../game/personalization';
import {
  CONTINUE_COST,
  loadRankings,
  RankingEntry,
  saveRanking,
} from '../game/ranking';
import { Board, GRID_SIZE, Piece } from '../game/types';
import { DraggablePiece } from './DraggablePiece';
import { GameBoard } from './GameBoard';
import { GameOverModal } from './GameOverModal';
import { NameSetupModal } from './NameSetupModal';
import { RankingModal } from './RankingModal';

const HIGH_SCORE_KEY = 'siyul-tetris-high-score';
const SCREEN_WIDTH = Dimensions.get('window').width;
const BOARD_CELL_SIZE = Math.floor((SCREEN_WIDTH - 48) / GRID_SIZE);
const TRAY_CELL_SIZE = Math.floor(BOARD_CELL_SIZE * 0.65);

export function GameScreen() {
  const { playerName, needsSetup, setPlayerName } = usePlayerSettings();
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [tray, setTray] = useState<Piece[]>(() => createTray());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [showRanking, setShowRanking] = useState(false);
  const [showNameSetup, setShowNameSetup] = useState(false);
  const [cheerMessage, setCheerMessage] = useState<string | null>(null);
  const [hint, setHint] = useState(getHintMessage(playerName));
  const [preview, setPreview] = useState<{
    piece: Piece;
    row: number;
    col: number;
    valid: boolean;
  } | null>(null);
  const [boardLayout, setBoardLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    AsyncStorage.getItem(HIGH_SCORE_KEY).then((value) => {
      if (value) setHighScore(Number(value));
    });
    loadRankings().then(setRankings);
  }, []);

  useEffect(() => {
    setHint(getHintMessage(playerName));
  }, [playerName]);

  useEffect(() => {
    if (!cheerMessage) return undefined;

    const timer = setTimeout(() => {
      setCheerMessage(null);
      setHint(getHintMessage(playerName));
    }, 2000);

    return () => clearTimeout(timer);
  }, [cheerMessage, playerName]);

  const updateHighScore = useCallback((nextScore: number) => {
    setHighScore((prev) => {
      if (nextScore <= prev) return prev;
      AsyncStorage.setItem(HIGH_SCORE_KEY, String(nextScore));
      return nextScore;
    });
  }, []);

  const refillTrayIfNeeded = useCallback((nextTray: Piece[]) => {
    if (nextTray.length === 0) {
      return createTray();
    }
    return nextTray;
  }, []);

  const checkGameOver = useCallback((nextBoard: Board, nextTray: Piece[]) => {
    if (!hasAnyValidMove(nextBoard, nextTray)) {
      setGameOver(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, []);

  const getPreviewFromTouch = useCallback(
    (piece: Piece, absoluteX: number, absoluteY: number) => {
      if (boardLayout.width === 0) return null;

      const localX = absoluteX - boardLayout.x;
      const localY = absoluteY - boardLayout.y;

      if (
        localX < 0 ||
        localY < 0 ||
        localX > boardLayout.width ||
        localY > boardLayout.height
      ) {
        return null;
      }

      const col = Math.floor(localX / BOARD_CELL_SIZE);
      const row = Math.floor(localY / BOARD_CELL_SIZE);
      const centeredCol = col - Math.floor(piece.shape[0].length / 2);
      const centeredRow = row - Math.floor(piece.shape.length / 2);

      const snapped = snapPlacement(board, piece.shape, centeredRow, centeredCol);
      if (!snapped) return null;

      return {
        piece,
        row: snapped.row,
        col: snapped.col,
        valid: snapped.valid,
      };
    },
    [board, boardLayout],
  );

  const handleDragStart = useCallback((_piece: Piece) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleDragMove = useCallback(
    (piece: Piece, absoluteX: number, absoluteY: number) => {
      const nextPreview = getPreviewFromTouch(piece, absoluteX, absoluteY);
      setPreview(nextPreview);
    },
    [getPreviewFromTouch],
  );

  const handleDragEnd = useCallback(
    (piece: Piece, absoluteX: number, absoluteY: number) => {
      const nextPreview = getPreviewFromTouch(piece, absoluteX, absoluteY);
      setPreview(null);

      if (!nextPreview || !nextPreview.valid) {
        return;
      }

      if (!canPlace(board, piece.shape, nextPreview.row, nextPreview.col)) {
        return;
      }

      const placedBoard = placePiece(
        board,
        piece.shape,
        nextPreview.row,
        nextPreview.col,
        piece.color,
      );
      const { board: clearedBoard, clearedLines, scoreGained } =
        clearCompletedLines(placedBoard);

      const nextTray = refillTrayIfNeeded(
        tray.filter((trayPiece) => trayPiece.id !== piece.id),
      );

      setBoard(clearedBoard);
      setTray(nextTray);

      const blockPoints = piece.shape.flat().filter((v) => v === 1).length;
      const nextScore = score + scoreGained + blockPoints;
      setScore(nextScore);
      updateHighScore(nextScore);

      if (clearedLines > 0) {
        setCheerMessage(getLineClearMessage(playerName, clearedLines));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      checkGameOver(clearedBoard, nextTray);
    },
    [
      board,
      tray,
      score,
      playerName,
      getPreviewFromTouch,
      refillTrayIfNeeded,
      updateHighScore,
      checkGameOver,
    ],
  );

  const continueGame = useCallback(() => {
    const nextScore = score - CONTINUE_COST;
    const relievedBoard = clearBottomRows(board, CONTINUE_CLEAR_ROWS);
    const nextTray = createTray();

    setScore(nextScore);
    setBoard(relievedBoard);
    setTray(nextTray);
    setGameOver(false);
    setPreview(null);
    setCheerMessage(getContinueCheerMessage(playerName));

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (!hasAnyValidMove(relievedBoard, nextTray)) {
      setGameOver(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [board, score, playerName]);

  const registerRanking = useCallback(async (name: string) => {
    const nextRankings = await saveRanking(name, score, playerName);
    setRankings(nextRankings);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [score, playerName]);

  const restartGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setTray(createTray());
    setScore(0);
    setGameOver(false);
    setPreview(null);
    setCheerMessage(null);
    setHint(getHintMessage(playerName));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, [playerName]);

  const handleSavePlayerName = useCallback(async (name: string) => {
    await setPlayerName(name);
    setShowNameSetup(false);
    setHint(getHintMessage(name));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [setPlayerName]);

  const canContinue = score >= CONTINUE_COST;
  const displayMessage = cheerMessage ?? hint;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.nameButton} onPress={() => setShowNameSetup(true)}>
          <Text style={styles.badge}>{getBadgeLabel(playerName)}</Text>
        </Pressable>
        <Text style={styles.title}>{getGameTitle(playerName)}</Text>
        <Text style={styles.subtitle}>{getGameSubtitle(playerName)}</Text>
        <Pressable onPress={() => setShowNameSetup(true)}>
          <Text style={styles.nameEdit}>이름 바꾸기</Text>
        </Pressable>
        <View style={styles.scoreRow}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>점수</Text>
            <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>최고</Text>
            <Text style={styles.scoreValue}>{highScore.toLocaleString()}</Text>
          </View>
          <Pressable style={styles.rankingButton} onPress={() => setShowRanking(true)}>
            <Text style={styles.rankingButtonText}>랭킹</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.boardArea}>
        <GameBoard
          board={board}
          cellSize={BOARD_CELL_SIZE}
          preview={preview}
          onLayout={setBoardLayout}
        />
      </View>

      <Text style={[styles.hint, cheerMessage && styles.cheer]}>
        {displayMessage}
      </Text>

      <View style={styles.tray}>
        {tray.map((piece) => (
          <View key={piece.id} style={styles.traySlot}>
            <DraggablePiece
              piece={piece}
              cellSize={TRAY_CELL_SIZE}
              disabled={gameOver}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            />
          </View>
        ))}
      </View>

      <NameSetupModal
        visible={needsSetup || showNameSetup}
        initialName={playerName}
        isFirstSetup={needsSetup}
        onSave={handleSavePlayerName}
        onClose={needsSetup ? undefined : () => setShowNameSetup(false)}
      />

      <GameOverModal
        visible={gameOver}
        playerName={playerName}
        score={score}
        highScore={highScore}
        canContinue={canContinue}
        onContinue={continueGame}
        onRegister={registerRanking}
        onRestart={restartGame}
      />

      <RankingModal
        visible={showRanking}
        playerName={playerName}
        rankings={rankings}
        onClose={() => setShowRanking(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  nameButton: {
    marginBottom: 6,
  },
  badge: {
    backgroundColor: '#F472B6',
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFE66D',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9A8D4',
    marginBottom: 4,
  },
  nameEdit: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
    textDecorationLine: 'underline',
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  scoreBox: {
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignItems: 'center',
    minWidth: 88,
  },
  scoreLabel: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
  },
  scoreValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  rankingButton: {
    backgroundColor: '#4A4A6A',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  rankingButtonText: {
    color: '#FFE66D',
    fontSize: 14,
    fontWeight: '800',
  },
  boardArea: {
    alignItems: 'center',
    marginBottom: 12,
  },
  hint: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 16,
    minHeight: 20,
  },
  cheer: {
    color: '#FFE66D',
    fontSize: 16,
    fontWeight: '800',
  },
  tray: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#2D2D44',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F472B6',
    paddingVertical: 20,
    paddingHorizontal: 8,
    minHeight: 120,
  },
  traySlot: {
    width: SCREEN_WIDTH / 3 - 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
});
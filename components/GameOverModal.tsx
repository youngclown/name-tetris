import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  getBadgeLabel,
  getContinueMessage,
  getGameOverMessage,
  getNewRecordMessage,
} from '../game/personalization';
import { CONTINUE_COST } from '../game/ranking';

interface GameOverModalProps {
  visible: boolean;
  playerName: string;
  score: number;
  highScore: number;
  canContinue: boolean;
  onContinue: () => void;
  onRegister: (name: string) => void;
  onRestart: () => void;
}

export function GameOverModal({
  visible,
  playerName,
  score,
  highScore,
  canContinue,
  onContinue,
  onRegister,
  onRestart,
}: GameOverModalProps) {
  const [showNameInput, setShowNameInput] = useState(false);
  const [rankingName, setRankingName] = useState(playerName);

  useEffect(() => {
    if (!visible) {
      setShowNameInput(false);
      setRankingName(playerName);
    }
  }, [visible, playerName]);

  const handleRegister = () => {
    if (score <= 0) return;
    onRegister(rankingName);
    setShowNameInput(false);
    setRankingName(playerName);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.badge}>{getBadgeLabel(playerName)}</Text>
          <Text style={styles.title}>게임 오버!</Text>
          <Text style={styles.subtitle}>{getGameOverMessage(playerName)}</Text>
          <Text style={styles.score}>점수: {score.toLocaleString()}</Text>
          {score >= highScore && score > 0 && (
            <Text style={styles.record}>{getNewRecordMessage(playerName)}</Text>
          )}

          {showNameInput ? (
            <View style={styles.nameSection}>
              <Text style={styles.nameLabel}>랭킹에 올릴 이름</Text>
              <TextInput
                style={styles.nameInput}
                value={rankingName}
                onChangeText={setRankingName}
                placeholder={playerName}
                placeholderTextColor="#6B7280"
                maxLength={12}
                autoFocus
              />
              <Pressable
                style={[styles.button, styles.registerButton, score <= 0 && styles.disabled]}
                onPress={handleRegister}
                disabled={score <= 0}
              >
                <Text style={styles.registerText}>랭킹 등록</Text>
              </Pressable>
              <Pressable
                style={styles.textButton}
                onPress={() => setShowNameInput(false)}
              >
                <Text style={styles.textButtonLabel}>취소</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.actions}>
              {canContinue && (
                <>
                  <Pressable style={[styles.button, styles.continueButton]} onPress={onContinue}>
                    <Text style={styles.continueText}>
                      이어하기 (-{CONTINUE_COST.toLocaleString()}점)
                    </Text>
                  </Pressable>
                  <Text style={styles.continueHint}>{getContinueMessage()}</Text>
                </>
              )}

              {score > 0 && (
                <Pressable
                  style={[styles.button, styles.registerButton]}
                  onPress={() => setShowNameInput(true)}
                >
                  <Text style={styles.registerText}>랭킹 등록하기</Text>
                </Pressable>
              )}

              <Pressable style={[styles.button, styles.restartButton]} onPress={onRestart}>
                <Text style={styles.restartText}>새 게임</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#2D2D44',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  badge: {
    backgroundColor: '#F472B6',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#F9A8D4',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  score: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  record: {
    fontSize: 16,
    color: '#FFE66D',
    fontWeight: '700',
    marginBottom: 16,
  },
  actions: {
    width: '100%',
    gap: 10,
    marginTop: 16,
  },
  continueHint: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  nameSection: {
    width: '100%',
    marginTop: 16,
  },
  nameLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  nameInput: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F472B6',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 12,
    paddingHorizontal: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
  },
  continueButton: {
    backgroundColor: '#A78BFA',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  registerButton: {
    backgroundColor: '#FFE66D',
  },
  registerText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '800',
  },
  restartButton: {
    backgroundColor: '#4ECDC4',
  },
  restartText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.5,
  },
  textButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  textButtonLabel: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});
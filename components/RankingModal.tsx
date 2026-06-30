import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  getBadgeLabel,
  getRankingEmptyMessage,
  getRankingSubtitle,
  getRankingTitle,
} from '../game/personalization';
import { RankingEntry } from '../game/ranking';

interface RankingModalProps {
  visible: boolean;
  playerName: string;
  rankings: RankingEntry[];
  onClose: () => void;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function RankingModal({
  visible,
  playerName,
  rankings,
  onClose,
}: RankingModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.badge}>{getBadgeLabel(playerName)}</Text>
          <Text style={styles.title}>{getRankingTitle(playerName)}</Text>
          <Text style={styles.subtitle}>{getRankingSubtitle(playerName)}</Text>
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {rankings.length === 0 ? (
              <Text style={styles.empty}>{getRankingEmptyMessage(playerName)}</Text>
            ) : (
              rankings.map((entry, index) => (
                <View key={entry.id} style={styles.row}>
                  <Text style={[styles.rank, index < 3 && styles.topRank]}>
                    {index + 1}
                  </Text>
                  <View style={styles.info}>
                    <Text style={styles.name}>{entry.name}</Text>
                    <Text style={styles.date}>{formatDate(entry.date)}</Text>
                  </View>
                  <Text style={styles.score}>{entry.score.toLocaleString()}</Text>
                </View>
              ))
            )}
          </ScrollView>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>닫기</Text>
          </Pressable>
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
    padding: 24,
  },
  card: {
    backgroundColor: '#2D2D44',
    borderRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  badge: {
    alignSelf: 'center',
    backgroundColor: '#F472B6',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFE66D',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#F9A8D4',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  list: {
    maxHeight: 360,
  },
  empty: {
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 32,
    fontSize: 15,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  rank: {
    width: 28,
    fontSize: 18,
    fontWeight: '800',
    color: '#9CA3AF',
  },
  topRank: {
    color: '#FFE66D',
  },
  info: {
    flex: 1,
    marginLeft: 8,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  date: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  score: {
    color: '#4ECDC4',
    fontSize: 17,
    fontWeight: '800',
  },
  closeButton: {
    backgroundColor: '#4A4A6A',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getBadgeLabel, getPhotoModalDescription } from '../game/personalization';
import { Shape } from '../game/types';
import { BlockCell } from './BlockCell';

const PREVIEW_SHAPES: { label: string; shape: Shape }[] = [
  { label: 'ㅣ', shape: [[1], [1], [1], [1]] },
  { label: 'ㅡ', shape: [[1, 1, 1, 1]] },
  { label: 'ㅁ', shape: [[1, 1], [1, 1]] },
  { label: 'ㄴ', shape: [[1, 0], [1, 0], [1, 1]] },
  { label: 'ㄷ', shape: [[1, 1, 1], [1, 0, 0]] },
  { label: 'ㄱ', shape: [[1, 1], [0, 1], [0, 1]] },
];

interface PhotoModalProps {
  visible: boolean;
  playerName: string;
  imageUri: string | null;
  onClose: () => void;
  onImageSelected: (uri: string) => Promise<void>;
  onImageRemoved: () => Promise<void>;
}

function ShapePreview({
  label,
  shape,
  imageUri,
}: {
  label: string;
  shape: Shape;
  imageUri: string;
}) {
  const cellSize = 22;
  const rows = shape.length;
  const cols = shape[0].length;

  return (
    <View style={styles.previewItem}>
      <Text style={styles.previewLabel}>{label}</Text>
      <View style={[styles.previewShape, { width: cols * cellSize, height: rows * cellSize }]}>
        {shape.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.previewRow}>
            {row.map((cell, colIndex) =>
              cell === 1 ? (
                <BlockCell
                  key={`cell-${rowIndex}-${colIndex}`}
                  size={cellSize}
                  color="#4ECDC4"
                  imageUri={imageUri}
                  imageCrop={{
                    row: rowIndex,
                    col: colIndex,
                    rows,
                    cols,
                  }}
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
      </View>
    </View>
  );
}

export function PhotoModal({
  visible,
  playerName,
  imageUri,
  onClose,
  onImageSelected,
  onImageRemoved,
}: PhotoModalProps) {
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('사진 접근 필요', '블록에 넣을 사진을 선택하려면 사진 접근을 허용해 주세요.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (result.canceled || !result.assets[0]) return;

    setLoading(true);
    try {
      await onImageSelected(result.assets[0].uri);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    Alert.alert('사진 삭제', '블록 사진을 지울까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            await onImageRemoved();
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.badge}>{getBadgeLabel(playerName)}</Text>
          <Text style={styles.title}>블록 사진 넣기</Text>
          <Text style={styles.subtitle}>{getPhotoModalDescription(playerName)}</Text>

          {loading ? (
            <ActivityIndicator color="#FFE66D" size="large" style={styles.loader} />
          ) : imageUri ? (
            <ScrollView style={styles.previewScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.previewTitle}>미리보기</Text>
              <View style={styles.previewGrid}>
                {PREVIEW_SHAPES.map((item) => (
                  <ShapePreview
                    key={item.label}
                    label={item.label}
                    shape={item.shape}
                    imageUri={imageUri}
                  />
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>📷</Text>
              <Text style={styles.emptyText}>아직 등록된 사진이 없어요</Text>
            </View>
          )}

          <Pressable style={styles.pickButton} onPress={pickImage} disabled={loading}>
            <Text style={styles.pickText}>
              {imageUri ? '다른 사진 선택' : '사진 선택하기'}
            </Text>
          </Pressable>

          {imageUri && (
            <Pressable style={styles.removeButton} onPress={handleRemove} disabled={loading}>
              <Text style={styles.removeText}>사진 지우기 (색깔 블록으로)</Text>
            </Pressable>
          )}

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
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#2D2D44',
    borderRadius: 20,
    padding: 24,
    maxHeight: '90%',
  },
  badge: {
    alignSelf: 'center',
    backgroundColor: '#F472B6',
    color: '#FFFFFF',
    fontSize: 11,
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  loader: {
    marginVertical: 40,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 8,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 15,
  },
  previewScroll: {
    maxHeight: 280,
    marginBottom: 12,
  },
  previewTitle: {
    color: '#F9A8D4',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: 8,
  },
  previewItem: {
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 10,
    minWidth: 96,
  },
  previewLabel: {
    color: '#FFE66D',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  previewShape: {
    justifyContent: 'flex-start',
  },
  previewRow: {
    flexDirection: 'row',
  },
  pickButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  pickText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '800',
  },
  removeButton: {
    backgroundColor: '#4A4A6A',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  removeText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '700',
  },
  closeButton: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
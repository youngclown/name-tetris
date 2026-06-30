import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { getGameTitle } from '../game/personalization';
import { MAX_NAME_LENGTH } from '../game/playerSettings';

interface NameSetupModalProps {
  visible: boolean;
  initialName?: string;
  isFirstSetup?: boolean;
  onSave: (name: string) => Promise<void>;
  onClose?: () => void;
}

export function NameSetupModal({
  visible,
  initialName = '',
  isFirstSetup = false,
  onSave,
  onClose,
}: NameSetupModalProps) {
  const [name, setName] = useState(initialName);
  const [previewName, setPreviewName] = useState(initialName || 'OO');

  useEffect(() => {
    if (visible) {
      setName(initialName);
      setPreviewName(initialName || 'OO');
    }
  }, [visible, initialName]);

  const handleChange = (value: string) => {
    setName(value);
    setPreviewName(value.trim() || 'OO');
  };

  const handleSave = async () => {
    await onSave(name);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {isFirstSetup ? '이름을 정해 주세요' : '이름 바꾸기'}
          </Text>
          <Text style={styles.subtitle}>
            {isFirstSetup
              ? '이름을 넣으면 나만의 테트리스가 만들어져요!'
              : '게임 속 이름과 응원 멘트가 함께 바뀌어요.'}
          </Text>

          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>미리보기</Text>
            <Text style={styles.previewTitle}>{getGameTitle(previewName)}</Text>
          </View>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={handleChange}
            placeholder="예: 시율"
            placeholderTextColor="#6B7280"
            maxLength={MAX_NAME_LENGTH}
            autoFocus={isFirstSetup}
          />
          <Text style={styles.inputHint}>최대 {MAX_NAME_LENGTH}글자</Text>

          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>
              {isFirstSetup ? '시작하기' : '저장하기'}
            </Text>
          </Pressable>

          {!isFirstSetup && onClose && (
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>취소</Text>
            </Pressable>
          )}
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
    padding: 24,
  },
  card: {
    backgroundColor: '#2D2D44',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFE66D',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  previewBox: {
    width: '100%',
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  previewLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  previewTitle: {
    color: '#F9A8D4',
    fontSize: 22,
    fontWeight: '800',
  },
  input: {
    width: '100%',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F472B6',
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    paddingVertical: 14,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  inputHint: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 6,
    marginBottom: 16,
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveText: {
    color: '#1a1a2e',
    fontSize: 17,
    fontWeight: '800',
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 8,
  },
  cancelText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});
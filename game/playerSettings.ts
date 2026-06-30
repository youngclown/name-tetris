import AsyncStorage from '@react-native-async-storage/async-storage';

export const PLAYER_NAME_KEY = 'player-name';
export const DEFAULT_PLAYER_NAME = '친구';
export const MAX_NAME_LENGTH = 8;

export function normalizePlayerName(name: string): string {
  const trimmed = name.trim().slice(0, MAX_NAME_LENGTH);
  return trimmed || DEFAULT_PLAYER_NAME;
}

export async function loadPlayerName(): Promise<string | null> {
  const value = await AsyncStorage.getItem(PLAYER_NAME_KEY);
  if (!value) return null;
  return normalizePlayerName(value);
}

export async function savePlayerName(name: string): Promise<string> {
  const normalized = normalizePlayerName(name);
  await AsyncStorage.setItem(PLAYER_NAME_KEY, normalized);
  return normalized;
}
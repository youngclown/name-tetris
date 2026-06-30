import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_PLAYER_NAME } from './playerSettings';

export const RANKING_KEY = 'siyul-tetris-rankings';
export const CONTINUE_COST = 10000;
export const MAX_RANKINGS = 50;

export interface RankingEntry {
  id: string;
  name: string;
  score: number;
  date: string;
}

export async function loadRankings(): Promise<RankingEntry[]> {
  const raw = await AsyncStorage.getItem(RANKING_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as RankingEntry[];
    return parsed.sort((a, b) => b.score - a.score);
  } catch {
    return [];
  }
}

export async function saveRanking(
  name: string,
  score: number,
  defaultName: string = DEFAULT_PLAYER_NAME,
): Promise<RankingEntry[]> {
  const trimmedName = name.trim().slice(0, 12) || defaultName;
  const rankings = await loadRankings();

  const entry: RankingEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: trimmedName,
    score,
    date: new Date().toISOString(),
  };

  const next = [...rankings, entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RANKINGS);

  await AsyncStorage.setItem(RANKING_KEY, JSON.stringify(next));
  return next;
}
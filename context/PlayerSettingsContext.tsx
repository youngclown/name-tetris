import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DEFAULT_PLAYER_NAME,
  loadPlayerName,
  normalizePlayerName,
  savePlayerName,
} from '../game/playerSettings';

interface PlayerSettingsContextValue {
  playerName: string;
  isLoaded: boolean;
  needsSetup: boolean;
  setPlayerName: (name: string) => Promise<string>;
}

const PlayerSettingsContext = createContext<PlayerSettingsContextValue | null>(null);

export function PlayerSettingsProvider({ children }: { children: React.ReactNode }) {
  const [playerName, setPlayerNameState] = useState(DEFAULT_PLAYER_NAME);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasSavedName, setHasSavedName] = useState(false);

  useEffect(() => {
    loadPlayerName().then((savedName) => {
      if (savedName) {
        setPlayerNameState(savedName);
        setHasSavedName(true);
      }
      setIsLoaded(true);
    });
  }, []);

  const setPlayerName = useCallback(async (name: string) => {
    const normalized = normalizePlayerName(name);
    await savePlayerName(normalized);
    setPlayerNameState(normalized);
    setHasSavedName(true);
    return normalized;
  }, []);

  const value = useMemo(
    () => ({
      playerName,
      isLoaded,
      needsSetup: isLoaded && !hasSavedName,
      setPlayerName,
    }),
    [playerName, isLoaded, hasSavedName, setPlayerName],
  );

  return (
    <PlayerSettingsContext.Provider value={value}>
      {children}
    </PlayerSettingsContext.Provider>
  );
}

export function usePlayerSettings(): PlayerSettingsContextValue {
  const context = useContext(PlayerSettingsContext);
  if (!context) {
    throw new Error('usePlayerSettings must be used within PlayerSettingsProvider');
  }
  return context;
}
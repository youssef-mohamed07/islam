'use client';

import React, { createContext, useContext, useState } from 'react';

export interface AudioTrack {
  surahId: number;
  surahName: string;
  ayahNumber: number;
  reciterName: string;
  playMode?: 'verse' | 'surah';
  totalVerses?: number;
}

interface ShellContextValue {
  currentTrack: AudioTrack | null;
  playAudio: (surahId: number, surahName: string, ayahNumber: number, playMode?: 'verse' | 'surah', totalVerses?: number) => void;
  closeAudio: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

// Fallback keeps shared components (e.g. Header) usable on pages
// outside the (main) shell, such as /zakat.
const fallbackValue: ShellContextValue = {
  currentTrack: null,
  playAudio: () => {},
  closeAudio: () => {},
  isSearchOpen: false,
  openSearch: () => {},
  closeSearch: () => {},
};

const ShellContext = createContext<ShellContextValue | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const playAudio = (surahId: number, surahName: string, ayahNumber: number, playMode: 'verse' | 'surah' = 'verse', totalVerses?: number) => {
    setCurrentTrack({
      surahId,
      surahName,
      ayahNumber,
      reciterName: 'الشيخ محمد صديق المنشاوي',
      playMode,
      totalVerses,
    });
  };

  return (
    <ShellContext.Provider
      value={{
        currentTrack,
        playAudio,
        closeAudio: () => setCurrentTrack(null),
        isSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),
      }}
    >
      {children}
    </ShellContext.Provider>
  );
};

export const useShell = (): ShellContextValue => {
  return useContext(ShellContext) || fallbackValue;
};

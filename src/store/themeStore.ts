import { Appearance } from 'react-native';
import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  system: ThemeMode;
  useSystem: boolean;
  actions: {
    setMode: (mode: ThemeMode) => void;
    toggleMode: () => void;
    setUseSystem: (use: boolean) => void;
    refreshSystem: () => void;
  };
}

export const lightPalette = {
  background: '#FFFFFF',
  card: '#F3F4F6',
  text: '#111827',
  textDim: '#6B7280',
  primary: '#ff5a5f',
  primaryText: '#FFFFFF',
  border: '#E5E7EB',
  danger: '#DC2626',
};

export const darkPalette = {
  background: '#0B0F17',
  card: '#1F2937',
  text: '#F3F4F6',
  textDim: '#9CA3AF',
  primary: '#ff5a5f',
  primaryText: '#FFFFFF',
  border: '#374151',
  danger: '#F87171',
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  system: Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
  mode: Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
  useSystem: true,
  actions: {
    setMode: (mode) => set({ mode, useSystem: false }),
    toggleMode: () => set({ mode: get().mode === 'dark' ? 'light' : 'dark', useSystem: false }),
    setUseSystem: (use) => set({ useSystem: use, mode: use ? get().system : get().mode }),
    refreshSystem: () => {
      const sys = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
      set({ system: sys, mode: get().useSystem ? sys : get().mode });
    },
  },
}));

Appearance.addChangeListener(() => {
  useThemeStore.getState().actions.refreshSystem();
});

export function getPalette(mode: ThemeMode) {
  return mode === 'dark' ? darkPalette : lightPalette;
}

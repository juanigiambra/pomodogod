import { getPalette, useThemeStore } from '@/store/themeStore';
import { useCallback, useMemo } from 'react';

export function useAppTheme() {
  const mode = useThemeStore(s => s.mode);
  const useSystem = useThemeStore(s => s.useSystem);
  const actions = useThemeStore(s => s.actions);
  const colors = useMemo(() => getPalette(mode), [mode]);
  const toggle = useCallback(() => actions.toggleMode(), [actions]);
  const setMode = useCallback((m: 'light' | 'dark') => actions.setMode(m), [actions]);
  const setUseSystem = useCallback((v: boolean) => actions.setUseSystem(v), [actions]);
  return { mode, colors, toggle, setMode, setUseSystem, useSystem };
}

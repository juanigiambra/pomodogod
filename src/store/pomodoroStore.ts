// Store Pomodoro - español (AR)
import { PomodoroMode } from '@/types';
import { POMODORO_DEFAULTS } from '@/utils/constants';
import * as SecureStore from 'expo-secure-store';
import { produce } from 'immer';
import { create } from 'zustand';

const SECURE_KEY = 'pomodoro_settings_v1';

interface PomodoroState {
  mode: PomodoroMode;
  isRunning: boolean;
  secondsLeft: number;
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  roundsUntilLongBreak: number;
  completedWorkSessions: number;
  startedAt?: Date;
  actions: {
    start(): void;
    pause(): void;
    reset(): void;
    tick(): void;
    switchMode(mode: PomodoroMode): void;
    completeCycle(onWorkComplete?: () => void): void;
    updateSettings(data: Partial<Pick<PomodoroState, 'workDuration' | 'shortBreakDuration' | 'longBreakDuration' | 'roundsUntilLongBreak'>>): void;
  };
}

async function loadSettings() {
  try {
    const raw = await SecureStore.getItemAsync(SECURE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

async function saveSettings(state: PomodoroState) {
  const data = {
    workDuration: state.workDuration,
    shortBreakDuration: state.shortBreakDuration,
    longBreakDuration: state.longBreakDuration,
    roundsUntilLongBreak: state.roundsUntilLongBreak,
  };
  await SecureStore.setItemAsync(SECURE_KEY, JSON.stringify(data));
}

const initial: Omit<PomodoroState, 'actions'> = {
  mode: 'work',
  isRunning: false,
  secondsLeft: POMODORO_DEFAULTS.workDuration,
  workDuration: POMODORO_DEFAULTS.workDuration,
  shortBreakDuration: POMODORO_DEFAULTS.shortBreakDuration,
  longBreakDuration: POMODORO_DEFAULTS.longBreakDuration,
  roundsUntilLongBreak: POMODORO_DEFAULTS.roundsUntilLongBreak,
  completedWorkSessions: 0,
};

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  ...initial,
  actions: {
    start() {
      set((s) =>
        produce(s, (draft: PomodoroState) => {
          draft.isRunning = true;
          if (!draft.startedAt) draft.startedAt = new Date();
        }),
      );
    },
    pause() {
      set((s) =>
        produce(s, (draft: PomodoroState) => {
          draft.isRunning = false;
        }),
      );
    },
    reset() {
      set((s) =>
        produce(s, (draft: PomodoroState) => {
          draft.isRunning = false;
          draft.mode = 'work';
          draft.secondsLeft = draft.workDuration;
          draft.completedWorkSessions = 0;
          draft.startedAt = undefined;
        }),
      );
    },
    tick() {
      const { isRunning, secondsLeft } = get();
      if (!isRunning) return;
      if (secondsLeft <= 1) {
        get().actions.completeCycle();
        return;
      }
      set((s) =>
        produce(s, (draft: PomodoroState) => {
          draft.secondsLeft -= 1;
        }),
      );
    },
    switchMode(mode: PomodoroMode) {
      set((s) =>
        produce(s, (draft: PomodoroState) => {
          draft.mode = mode;
          if (mode === 'work') draft.secondsLeft = draft.workDuration;
          if (mode === 'shortBreak') draft.secondsLeft = draft.shortBreakDuration;
          if (mode === 'longBreak') draft.secondsLeft = draft.longBreakDuration;
          draft.isRunning = false;
          draft.startedAt = undefined;
        }),
      );
    },
    completeCycle(onWorkComplete?: () => void) {
      const state = get();
      if (state.mode === 'work') {
        onWorkComplete?.();
        const nextCount = state.completedWorkSessions + 1;
        const shouldLong =
          nextCount % state.roundsUntilLongBreak === 0 && nextCount > 0;
        set((s) =>
          produce(s, (draft: PomodoroState) => {
            draft.completedWorkSessions = nextCount;
            draft.mode = shouldLong ? 'longBreak' : 'shortBreak';
            draft.secondsLeft = shouldLong
              ? draft.longBreakDuration
              : draft.shortBreakDuration;
            draft.isRunning = false;
            draft.startedAt = undefined;
          }),
        );
      } else {
        set((s) =>
          produce(s, (draft: PomodoroState) => {
            draft.mode = 'work';
            draft.secondsLeft = draft.workDuration;
            draft.isRunning = false;
            draft.startedAt = undefined;
          }),
        );
      }
    },
    async updateSettings(data) {
      set((s) =>
        produce(s, (draft: PomodoroState) => {
          Object.assign(draft, data);
          if (data.workDuration && draft.mode === 'work')
            draft.secondsLeft = data.workDuration;
          if (data.shortBreakDuration && draft.mode === 'shortBreak')
            draft.secondsLeft = data.shortBreakDuration;
          if (data.longBreakDuration && draft.mode === 'longBreak')
            draft.secondsLeft = data.longBreakDuration;
        }),
      );
      await saveSettings(get());
    },
  },
}));

loadSettings().then((s) => {
  if (s) {
    usePomodoroStore.setState(
  produce(usePomodoroStore.getState(), (draft: PomodoroState) => {
        draft.workDuration = s.workDuration;
        draft.shortBreakDuration = s.shortBreakDuration;
        draft.longBreakDuration = s.longBreakDuration;
        draft.roundsUntilLongBreak = s.roundsUntilLongBreak;
        if (draft.mode === 'work') draft.secondsLeft = s.workDuration;
      }),
    );
  }
});

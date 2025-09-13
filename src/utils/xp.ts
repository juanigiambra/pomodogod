// Lógica de XP y niveles - español (AR)

export const BASE_XP = 50;
export const COINS_PER_POMODORO = 5;

export function xpForSession(streakDays: number): number {
  const bonus = Math.min(streakDays * 2, 20);
  return BASE_XP + bonus;
}

export function levelFromXp(xp: number): number {
  return Math.floor(Math.pow(xp / 100, 0.65)) + 1;
}

export function xpProgress(xp: number) {
  const level = levelFromXp(xp);
  const prevLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  return {
    level,
    current: xp - prevLevelXp,
    required: nextLevelXp - prevLevelXp,
  };
}

export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level - 1, 1 / 0.65));
}

// Servicio de logros - español (AR)
import { ACHIEVEMENTS, AchievementDef } from '@/constants/achievements';
import { levelFromXp } from '@/utils/xp';
import { getDoc, updateDoc } from 'firebase/firestore';
import { getInventory, userDoc } from './userService';

export interface AchievementStatus extends AchievementDef {
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number; // 0..1
  currentValue: number;
}

// Construye el contexto evaluando métricas mínimas (se puede ampliar luego)
async function buildContext(uid: string) {
  const userSnap = await getDoc(userDoc(uid));
  if (!userSnap.exists()) throw new Error('Perfil no encontrado');
  const profile: any = userSnap.data();
  const inventory = await getInventory(uid);
  const equippedCount = inventory.filter(i => i.equipped).length;
  const ctx = {
    sessionsCount: profile.sessionsCount || 0,
    totalWorkMinutes: (profile.totalWorkMinutes || 0),
    longestStreak: profile.longestStreak || profile.streakDays || 0,
    level: profile.level,
    coins: profile.coins,
    ownedItems: inventory.length,
    equippedCount,
    firstPurchase: inventory.length > 0,
  };
  return { ctx, profile };
}

export async function syncAchievements(uid: string) {
  if (!uid) return [] as AchievementStatus[];
  const { ctx, profile } = await buildContext(uid);
  const unlocked: string[] = profile.achievementsUnlocked || [];
  const newlyUnlocked: string[] = [];
  let gainedXpFromAchievements = 0;

  ACHIEVEMENTS.forEach(a => {
    const current = (ctx as any)[a.metric] ?? 0;
    if (!unlocked.includes(a.id) && current >= a.target) {
      newlyUnlocked.push(a.id);
      unlocked.push(a.id);
      gainedXpFromAchievements += a.xpReward;
    }
  });

  let updatedProfileXp = profile.xp;
  if (newlyUnlocked.length) {
    updatedProfileXp = profile.xp + gainedXpFromAchievements;
    const newLevel = levelFromXp(updatedProfileXp);
    const newAchievementsXpTotal = (profile.achievementsXpTotal || 0) + gainedXpFromAchievements;
    await updateDoc(userDoc(uid), {
      achievementsUnlocked: unlocked,
      xp: updatedProfileXp,
      level: newLevel,
      achievementsXpTotal: newAchievementsXpTotal,
      updatedAt: new Date(),
    });
  }

  const result = ACHIEVEMENTS.map(a => {
    const current = (ctx as any)[a.metric] ?? 0;
    const progress = Math.min(1, current / a.target);
    return { ...a, unlocked: unlocked.includes(a.id), progress, currentValue: current };
  });
  // anexamos metadata para UI mediante propiedad simbólica (opcional) -> por simplicidad devolvemos array pero podemos exponer new property en store luego
  (result as any)._newlyUnlocked = newlyUnlocked;
  return result;
}

export async function getAchievementsStatus(uid: string) {
  const snap = await getDoc(userDoc(uid));
  if (!snap.exists()) return ACHIEVEMENTS.map(a => ({ ...a, unlocked: false, progress: 0, currentValue: 0 }));
  const profile: any = snap.data();
  const unlocked: string[] = profile.achievementsUnlocked || [];
  const { ctx } = await buildContext(uid);
  return ACHIEVEMENTS.map(a => {
    const current = (ctx as any)[a.metric] ?? 0;
    const progress = Math.min(1, current / a.target);
    return { ...a, unlocked: unlocked.includes(a.id), progress, currentValue: current };
  });
}

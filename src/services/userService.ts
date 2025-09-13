// Servicios de usuario y sesiones - español (AR)
import { InventoryItem, Session, UserProfile } from '@/types';
import { COINS_PER_POMODORO, levelFromXp, xpForSession } from '@/utils/xp';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { ACHIEVEMENTS } from '@/constants/achievements';

function userConverter() {
  return {
    toFirestore(user: UserProfile) {
      return {
        uid: user.uid,
        displayName: user.displayName,
        level: user.level,
        xp: user.xp,
        coins: user.coins,
        avatar: user.avatar,
        streakDays: user.streakDays,
        sessionsCount: (user as any).sessionsCount || 0,
        longestStreak: (user as any).longestStreak || user.streakDays || 0,
        totalWorkMinutes: (user as any).totalWorkMinutes || 0,
        achievementsXpTotal: (user as any).achievementsXpTotal || 0,
        achievementsUnlocked: (user as any).achievementsUnlocked || [],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    },
    fromFirestore(snapshot: any): UserProfile {
      const d = snapshot.data();
      return {
        uid: d.uid,
        displayName: d.displayName,
        level: d.level,
        xp: d.xp,
        coins: d.coins,
        avatar: d.avatar || {},
        streakDays: d.streakDays || 0,
        sessionsCount: d.sessionsCount || 0,
        longestStreak: d.longestStreak || d.streakDays || 0,
        totalWorkMinutes: d.totalWorkMinutes || 0,
        achievementsXpTotal: d.achievementsXpTotal || 0,
        achievementsUnlocked: d.achievementsUnlocked || [],
        createdAt: d.createdAt?.toDate?.() || new Date(),
        updatedAt: d.updatedAt?.toDate?.() || new Date(),
      };
    },
  };
}

function sessionConverter() {
  return {
    toFirestore(s: Session) {
      return {
        uid: s.uid,
        startedAt: s.startedAt,
        endedAt: s.endedAt,
        durationSec: s.durationSec,
        type: s.type,
        completed: s.completed,
      };
    },
    fromFirestore(snapshot: any): Session {
      const d = snapshot.data();
      return {
        id: snapshot.id,
        uid: d.uid,
        startedAt: d.startedAt?.toDate?.() || new Date(),
        endedAt: d.endedAt?.toDate?.() || new Date(),
        durationSec: d.durationSec,
        type: d.type,
        completed: d.completed,
      };
    },
  };
}

function inventoryConverter() {
  return {
    toFirestore(i: InventoryItem) {
      return {
        uid: i.uid,
        itemId: i.itemId,
        category: i.category,
        equipped: i.equipped,
      };
    },
    fromFirestore(snapshot: any): InventoryItem {
      const d = snapshot.data();
      return {
        id: snapshot.id,
        uid: d.uid,
        itemId: d.itemId,
        category: d.category,
        equipped: d.equipped,
      };
    },
  };
}

export const userDoc = (uid: string) =>
  doc(db, 'users', uid).withConverter(userConverter());
export const sessionsCol = collection(db, 'sessions').withConverter(
  sessionConverter(),
);
export const inventoryCol = collection(db, 'inventory').withConverter(
  inventoryConverter(),
);

export async function ensureUserProfile(uid: string, displayName?: string) {
  const ref = userDoc(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const now = new Date();
    const profile: UserProfile = {
      uid,
      displayName: displayName || 'Anon',
      level: 1,
      xp: 0,
      coins: 0,
      avatar: {},
      streakDays: 0,
      // nuevo campo para logros
      sessionsCount: 0,
      longestStreak: 0,
      totalWorkMinutes: 0,
      achievementsXpTotal: 0,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(ref, userConverter().toFirestore(profile));
    return profile;
  }
  return snap.data();
}

interface AwardPayload {
  startedAt: Date;
  endedAt: Date;
  durationSec: number;
  type: 'work' | 'shortBreak' | 'longBreak';
  streakDays: number;
}

export async function awardOnPomodoroComplete(
  uid: string,
  payload: AwardPayload,
) {
  if (!uid) return;
  const userRef = userDoc(uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  const streakDays = payload.streakDays;
  const gainedXp = xpForSession(streakDays);
  const gainedCoins = COINS_PER_POMODORO;

  const batch = writeBatch(db);
  const sessionData: Session = {
    uid,
    startedAt: payload.startedAt,
    endedAt: payload.endedAt,
    durationSec: payload.durationSec,
    type: payload.type,
    completed: true,
  };
  const sessionRef = doc(sessionsCol);
  batch.set(sessionRef, sessionData);

  const u = userSnap.data();
  const newXp = u.xp + gainedXp;
  const newLevel = levelFromXp(newXp);
  const isWork = payload.type === 'work';
  const addedMinutes = isWork ? Math.round(payload.durationSec / 60) : 0;
  const prevTotalMinutes = (u as any).totalWorkMinutes || 0;
  const newTotalMinutes = prevTotalMinutes + addedMinutes;
  const prevLongest = (u as any).longestStreak || u.streakDays || 0;
  const newLongest = streakDays > prevLongest ? streakDays : prevLongest;

  batch.update(userRef, {
    xp: newXp,
    coins: u.coins + gainedCoins,
    level: newLevel,
    streakDays: streakDays,
    longestStreak: newLongest,
    totalWorkMinutes: newTotalMinutes,
    sessionsCount: (u as any).sessionsCount ? (u as any).sessionsCount + 1 : 1,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
  return { gainedXp, gainedCoins, newLevel };
}

export async function fetchRecentSessions(uid: string, max = 10) {
  if (!uid) return [];
  const q = query(
    sessionsCol,
    where('uid', '==', uid),
    orderBy('endedAt', 'desc'),
    limit(max),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function getInventory(uid: string) {
  if (!uid) return [];
  const q = query(inventoryCol, where('uid', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function equipItem(
  uid: string,
  itemId: string,
  category: InventoryItem['category'],
) {
  if (!uid) return;
  const all = await getInventory(uid);
  const batch = writeBatch(db);
  all
    .filter((i) => i.category === category)
    .forEach((i) => {
      const ref = doc(db, 'inventory', i.id!);
      batch.update(ref, { equipped: i.itemId === itemId });
    });
  await batch.commit();
}

export async function addInventoryItem(item: InventoryItem) {
  if (!item.uid) throw new Error('uid requerido');
  await addDoc(inventoryCol, item);
}

// --- Utilidades de migración / mantenimiento ---
import { levelFromXp as _levelFromXp } from '@/utils/xp';

export async function recalcUserLevel(uid: string) {
  const snap = await getDoc(userDoc(uid));
  if (!snap.exists()) return;
  const u: any = snap.data();
  const newLevel = _levelFromXp(u.xp || 0);
  if (newLevel !== u.level) {
    await updateDoc(userDoc(uid), { level: newLevel, updatedAt: serverTimestamp() });
  }
}

export async function migrateAchievementXp(uid: string) {
  const ref = userDoc(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const u: any = snap.data();
  if (u.achievementsXpTotal !== undefined) return; // ya migrado
  const unlocked: string[] = u.achievementsUnlocked || [];
  const expected = ACHIEVEMENTS.filter(a => unlocked.includes(a.id)).reduce((sum, a) => sum + a.xpReward, 0);
  const newXp = (u.xp || 0) + expected;
  const level = _levelFromXp(newXp);
  await updateDoc(ref, {
    xp: newXp,
    level,
    achievementsXpTotal: expected,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Ejemplo de uso tras login (llamar una sola vez por usuario pre-existente):
 * 
 *   await migrateAchievementXp(uid);
 *   await recalcUserLevel(uid); // redundante pero seguro
 *   // luego refreshProfile(); para traer nivel actualizado al store
 */

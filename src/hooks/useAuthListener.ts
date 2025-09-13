// Hook listener de auth - español (AR)
import { auth, onAuthStateChanged } from '@/services/firebase';
import { ensureUserProfile, migrateAchievementXp, recalcUserLevel } from '@/services/userService';
import { useUserStore } from '@/store/userStore';
import { useEffect, useState } from 'react';

export function useAuthListener() {
  const setUser = useUserStore((s) => s.actions.setUser);
  const refreshProfile = useUserStore((s) => s.actions.refreshProfile);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user?.uid);
      if (user?.uid) {
        try { await ensureUserProfile(user.uid); } catch (e) { /* noop */ }
        // Migración silenciosa: sólo hace algo si achievementsXpTotal aún no existe
        try {
          await migrateAchievementXp(user.uid);
          await recalcUserLevel(user.uid);
        } catch (e) { /* noop */ }
        await refreshProfile();
      }
      if (initializing) setInitializing(false);
    });
    return () => unsub();
  }, [setUser, refreshProfile, initializing]);

  return { initializing };
}

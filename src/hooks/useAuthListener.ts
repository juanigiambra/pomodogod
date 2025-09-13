// Hook listener de auth - español (AR)
import { auth, onAuthStateChanged } from '@/services/firebase';
import { ensureUserProfile } from '@/services/userService';
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
        // Garantiza que el perfil exista (por ejemplo login con proveedor externo futuro)
        try { await ensureUserProfile(user.uid); } catch (e) { /* noop */ }
        await refreshProfile();
      }
      if (initializing) setInitializing(false);
    });
    return () => unsub();
  }, [setUser, refreshProfile, initializing]);

  return { initializing };
}

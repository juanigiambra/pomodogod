// Hook para obtener perfil reactivo - español (AR)
import { db } from '@/services/firebase';
import { useUserStore } from '@/store/userStore';
import { UserProfile } from '@/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export function useUserProfile() {
  const uid = useUserStore((s) => s.uid);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      return;
    }
    setLoading(true);
    const ref = doc(db, 'users', uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const d = snap.data() as any;
        setProfile({
          uid: d.uid,
          displayName: d.displayName,
          level: d.level,
          xp: d.xp,
          coins: d.coins,
          avatar: d.avatar || {},
          streakDays: d.streakDays || 0,
          createdAt: d.createdAt?.toDate?.() || new Date(),
          updatedAt: d.updatedAt?.toDate?.() || new Date(),
        });
      }
      setLoading(false);
    });
    return () => unsub();
  }, [uid]);

  return { profile, loading };
}

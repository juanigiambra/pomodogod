// Store de usuario - español (AR)
import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from '@/services/firebase';
import { ensureUserProfile } from '@/services/userService';
import { UserProfile } from '@/types';
import { create } from 'zustand';

interface UserState {
  uid?: string;
  profile?: UserProfile | null;
  loading: boolean;
  actions: {
    setUser(uid?: string): void;
    refreshProfile(): Promise<void>;
    signIn(email: string, password: string): Promise<void>;
    signUp(email: string, password: string): Promise<void>;
    signOut(): Promise<void>;
  };
}

export const useUserStore = create<UserState>((set, get) => ({
  uid: undefined,
  profile: null,
  loading: false,
  actions: {
    setUser(uid) {
      set({ uid, profile: uid ? get().profile : null });
    },
    async refreshProfile() {
      const uid = get().uid;
      if (!uid) return;
      set({ loading: true });
      try {
        const profile = await ensureUserProfile(uid);
        set({ profile });
      } finally {
        set({ loading: false });
      }
    },
    async signIn(email, password) {
      set({ loading: true });
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        get().actions.setUser(cred.user.uid);
        await get().actions.refreshProfile();
      } finally {
        set({ loading: false });
      }
    },
    async signUp(email, password) {
      set({ loading: true });
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        get().actions.setUser(cred.user.uid);
        await ensureUserProfile(cred.user.uid, email.split('@')[0]);
        await get().actions.refreshProfile();
      } finally {
        set({ loading: false });
      }
    },
    async signOut() {
      await signOut(auth);
      set({ uid: undefined, profile: null });
    },
  },
}));

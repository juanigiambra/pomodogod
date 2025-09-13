// Inicialización Firebase - español (AR)
import { getApps, initializeApp } from 'firebase/app';
import {
    createUserWithEmailAndPassword,
    initializeAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
} from 'firebase/auth';
import {
    DocumentData,
    Firestore,
    getFirestore,
    QueryDocumentSnapshot,
    serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Persistencia para React Native con AsyncStorage
// Import dinámico para evitar fallar en entornos web/bundlers que no soporten react-native AsyncStorage
let authSingleton: ReturnType<typeof initializeAuth> | null = null;
try {
    // Cargamos dependencias solo si estamos en un entorno RN (no web) y aún no inicializamos
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getReactNativePersistence } = require('firebase/auth');
    authSingleton = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    } as any);
} catch (e) {
    // Fallback sin persistencia explícita (web o error de require)
    if (!authSingleton) {
        authSingleton = initializeAuth(app, {} as any);
    }
}

export const auth = authSingleton!;
export const db: Firestore = getFirestore(app);
export const ts = serverTimestamp;

export {
    createUserWithEmailAndPassword, DocumentData, onAuthStateChanged, QueryDocumentSnapshot, signInWithEmailAndPassword, signOut,
    User
};


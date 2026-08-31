import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

// Config from VITE_FIREBASE_* env (see .env.example). If absent, cloud is
// disabled and the app runs local-only. The Firebase SDK is loaded lazily
// (dynamic import) so local-only users never download it.
const env = import.meta.env as Record<string, string | undefined>;
const cfg = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export const cloudEnabled = Boolean(cfg.apiKey && cfg.projectId);

let cache: Promise<{ auth: Auth; firestore: Firestore }> | null = null;

export function loadFirebase(): Promise<{ auth: Auth; firestore: Firestore }> {
  if (!cache)
    cache = (async () => {
      const [{ initializeApp }, { getAuth }, { getFirestore }] = await Promise.all([
        import('firebase/app'),
        import('firebase/auth'),
        import('firebase/firestore'),
      ]);
      const app = initializeApp(cfg);
      return { auth: getAuth(app), firestore: getFirestore(app) };
    })();
  return cache;
}

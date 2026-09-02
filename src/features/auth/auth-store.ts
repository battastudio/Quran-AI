import { create } from 'zustand';
import type { User } from 'firebase/auth';
import { cloudEnabled, loadFirebase } from '../../lib/firebase';
import { syncNow, watchRemote } from '../../lib/sync';
import { useSettings } from '../../store/settings-store';
import { useReader } from '../../store/reader-store';

let unwatch: (() => void) | null = null;

// Re-hydrate memory-held stores after a live remote apply (db-backed screens
// refresh on their own next open).
function reHydrate() {
  void useSettings.getState().hydrate();
  void useReader.getState().hydrate();
}

type Status = 'idle' | 'syncing' | 'synced' | 'error';

interface AuthState {
  cloud: boolean;
  user: User | null;
  status: Status;
  init: () => void;
  signInGoogle: () => Promise<void>;
  signInEmail: (email: string, pass: string, isNew: boolean) => Promise<void>;
  signOutUser: () => Promise<void>;
  sync: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  cloud: cloudEnabled,
  user: null,
  status: 'idle',
  init: () => {
    if (!cloudEnabled) return;
    void (async () => {
      const { auth } = await loadFirebase();
      const { onAuthStateChanged } = await import('firebase/auth');
      onAuthStateChanged(auth, (user) => {
        set({ user });
        unwatch?.();
        unwatch = null;
        if (user) {
          void get().sync();
          // live cross-device apply; re-hydrate stores when remote data arrives
          void watchRemote(user.uid, reHydrate).then((u) => { unwatch = u; });
        }
      });
      // keep devices converged: re-sync periodically + when the tab refocuses
      setInterval(() => { if (get().user) void get().sync(); }, 60_000);
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && get().user) void get().sync();
      });
    })();
  },
  signInGoogle: async () => {
    const { auth } = await loadFirebase();
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    await signInWithPopup(auth, new GoogleAuthProvider());
    location.reload();
  },
  signInEmail: async (email, pass, isNew) => {
    const { auth } = await loadFirebase();
    const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = await import('firebase/auth');
    await (isNew ? createUserWithEmailAndPassword : signInWithEmailAndPassword)(auth, email, pass);
    location.reload();
  },
  signOutUser: async () => {
    const { auth } = await loadFirebase();
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
    set({ user: null, status: 'idle' });
  },
  sync: async () => {
    const user = get().user;
    if (!user) return;
    set({ status: 'syncing' });
    try {
      await syncNow(user.uid);
      set({ status: 'synced' });
    } catch {
      set({ status: 'error' });
    }
  },
}));

import { cloudEnabled, loadFirebase } from './firebase';
import { exportData, getKv, importData, setKv } from './db';
import { mergeProfiles, type Profile } from './merge';
import type { KhatmahPlan } from './khatmah';

async function localProfile(): Promise<Profile> {
  const base = await exportData();
  return {
    updatedAt: (await getKv<number>('profileUpdatedAt')) ?? 0,
    settings: base.settings as Profile['settings'],
    lastRead: base.lastRead as Profile['lastRead'],
    bookmarks: base.bookmarks,
    hifz: base.hifz,
    streak: (await getKv<string[]>('streakDays')) ?? [],
    khatmah: (await getKv<KhatmahPlan>('khatmah')) ?? null,
  };
}

async function applyProfile(p: Profile): Promise<void> {
  await importData({ settings: p.settings, lastRead: p.lastRead, bookmarks: p.bookmarks, hifz: p.hifz });
  await setKv('streakDays', p.streak);
  await setKv('khatmah', p.khatmah ?? null);
  await setKv('profileUpdatedAt', p.updatedAt);
}

// Pull remote, merge with local, write both. Called on sign-in and "sync now".
export async function syncNow(uid: string): Promise<void> {
  if (!cloudEnabled) return;
  const { firestore } = await loadFirebase();
  const { doc, getDoc, setDoc } = await import('firebase/firestore');
  const ref = doc(firestore, 'users', uid);
  const snap = await getDoc(ref);
  const local = await localProfile();
  const merged = snap.exists() ? mergeProfiles(local, snap.data() as Profile) : local;
  merged.updatedAt = Math.max(merged.updatedAt, Date.now());
  await applyProfile(merged);
  await setDoc(ref, merged);
}

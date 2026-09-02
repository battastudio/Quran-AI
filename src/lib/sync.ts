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
    notes: base.notes,
    highlights: base.highlights,
    hifz: base.hifz,
    streak: (await getKv<string[]>('streakDays')) ?? [],
    khatmah: (await getKv<KhatmahPlan>('khatmah')) ?? null,
  };
}

async function applyProfile(p: Profile): Promise<void> {
  await importData({ settings: p.settings, lastRead: p.lastRead, bookmarks: p.bookmarks, hifz: p.hifz, notes: p.notes, highlights: p.highlights });
  await setKv('streakDays', p.streak);
  await setKv('khatmah', p.khatmah ?? null);
  await setKv('profileUpdatedAt', p.updatedAt);
}

// Same data (ignoring the timestamp)? Used to avoid redundant writes / sync loops.
function sameProfile(a: Profile, b: Profile): boolean {
  const strip = (p: Profile) => JSON.stringify({ ...p, updatedAt: 0 });
  return strip(a) === strip(b);
}

// Pull remote, merge with local, write both (only if changed). Sign-in / "sync now".
export async function syncNow(uid: string): Promise<void> {
  if (!cloudEnabled) return;
  const { firestore } = await loadFirebase();
  const { doc, getDoc, setDoc } = await import('firebase/firestore');
  const ref = doc(firestore, 'users', uid);
  const snap = await getDoc(ref);
  const remote = snap.exists() ? (snap.data() as Profile) : null;
  const local = await localProfile();
  const merged = remote ? mergeProfiles(local, remote) : local;
  await applyProfile(merged);
  if (!remote || !sameProfile(merged, remote)) {
    merged.updatedAt = Math.max(merged.updatedAt, Date.now());
    await applyProfile(merged);
    await setDoc(ref, merged);
  }
}

// Live cross-device sync: apply remote changes to local as they arrive (silent —
// no push, no reload → no loops). Returns an unsubscribe.
export async function watchRemote(uid: string, onApplied: () => void): Promise<() => void> {
  if (!cloudEnabled) return () => {};
  const { firestore } = await loadFirebase();
  const { doc, onSnapshot } = await import('firebase/firestore');
  return onSnapshot(doc(firestore, 'users', uid), async (snap) => {
    if (!snap.exists() || snap.metadata.hasPendingWrites) return; // skip our own writes
    const remote = snap.data() as Profile;
    const local = await localProfile();
    const merged = mergeProfiles(local, remote);
    if (sameProfile(merged, local)) return; // nothing new
    await applyProfile(merged);
    onApplied();
  });
}

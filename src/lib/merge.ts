import type { HifzCard, Settings } from './types';
import type { KhatmahPlan } from './khatmah';

export interface Bookmark {
  key: string;
  surah: number;
  ayah: number;
  at: number;
}

// The synced profile (superset of exportData) — progress metadata only, no audio.
export interface Profile {
  updatedAt: number;
  settings?: Partial<Settings>;
  lastRead?: { surah: number; ayah: number };
  bookmarks: Bookmark[];
  hifz: HifzCard[];
  streak: string[];
  khatmah?: KhatmahPlan | null;
}

function unionBy<T>(a: T[], b: T[], key: (t: T) => string, pick: (x: T, y: T) => T): T[] {
  const map = new Map<string, T>();
  for (const item of [...a, ...b]) {
    const k = key(item);
    const existing = map.get(k);
    map.set(k, existing ? pick(existing, item) : item);
  }
  return [...map.values()];
}

// Merge two profiles without losing progress. Sets/collections union; scalar
// prefs follow the newer profile (updatedAt = last-write-wins).
export function mergeProfiles(a: Profile, b: Profile): Profile {
  const newer = a.updatedAt >= b.updatedAt ? a : b;
  return {
    updatedAt: Math.max(a.updatedAt, b.updatedAt),
    settings: newer.settings,
    lastRead: newer.lastRead,
    khatmah: newer.khatmah ?? null,
    bookmarks: unionBy(a.bookmarks, b.bookmarks, (x) => x.key, (x) => x),
    // keep the more-progressed card (more reps, else later due)
    hifz: unionBy(a.hifz, b.hifz, (x) => x.key, (x, y) =>
      y.reps > x.reps || (y.reps === x.reps && y.due > x.due) ? y : x,
    ),
    streak: [...new Set([...a.streak, ...b.streak])].sort(),
  };
}

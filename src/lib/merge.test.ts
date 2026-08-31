import { describe, expect, it } from 'vitest';
import { mergeProfiles, type Profile } from './merge';

const base: Profile = { updatedAt: 0, bookmarks: [], notes: [], hifz: [], streak: [] };

describe('mergeProfiles', () => {
  it('unions bookmarks by key', () => {
    const a = { ...base, bookmarks: [{ key: '1:1', surah: 1, ayah: 1, at: 1 }] };
    const b = { ...base, bookmarks: [{ key: '2:5', surah: 2, ayah: 5, at: 2 }] };
    expect(mergeProfiles(a, b).bookmarks).toHaveLength(2);
  });
  it('keeps the more-progressed hifz card', () => {
    const a = { ...base, hifz: [{ key: '1:1', surah: 1, ayah: 1, ease: 2.5, interval: 1, due: 10, reps: 1 }] };
    const b = { ...base, hifz: [{ key: '1:1', surah: 1, ayah: 1, ease: 2.6, interval: 6, due: 99, reps: 3 }] };
    expect(mergeProfiles(a, b).hifz[0].reps).toBe(3);
  });
  it('scalar prefs follow the newer profile', () => {
    const a = { ...base, updatedAt: 5, lastRead: { surah: 2, ayah: 3 } };
    const b = { ...base, updatedAt: 9, lastRead: { surah: 7, ayah: 1 } };
    expect(mergeProfiles(a, b).lastRead).toEqual({ surah: 7, ayah: 1 });
  });
  it('unions streak days', () => {
    const a = { ...base, streak: ['2026-08-30'] };
    const b = { ...base, streak: ['2026-08-31', '2026-08-30'] };
    expect(mergeProfiles(a, b).streak).toEqual(['2026-08-30', '2026-08-31']);
  });
});

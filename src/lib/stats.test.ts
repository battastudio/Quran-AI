import { describe, expect, it } from 'vitest';
import { JUZ_START, juzPercent, streakGrid } from './stats';
import { badges, earnedCount } from './badges';

describe('stats', () => {
  it('juzPercent counts read pages in the juz range', () => {
    const juz30 = 29; // pages 582..604
    const read = new Set<number>();
    for (let p = 582; p <= 604; p++) read.add(p);
    expect(juzPercent(read, juz30)).toBe(100);
    expect(juzPercent(new Set([582]), juz30)).toBeGreaterThan(0);
    expect(juzPercent(new Set([1]), juz30)).toBe(0);
  });
  it('JUZ_START spans the whole mushaf', () => {
    expect(JUZ_START[0]).toBe(1);
    expect(JUZ_START[30]).toBe(605);
  });
  it('streakGrid marks active days', () => {
    const grid = streakGrid(['2026-08-31', '2026-09-01'], 1, '2026-09-01');
    expect(grid[0][6]).toBe(true); // today
    expect(grid[0][5]).toBe(true); // yesterday
  });
});

describe('badges', () => {
  it('awards by thresholds', () => {
    const b = badges({ streak: 8, memorized: 5, juz30Done: false, khatmahPct: 0, minutes: 0 });
    expect(b.find((x) => x.id === 'streak7')!.earned).toBe(true);
    expect(b.find((x) => x.id === 'memo10')!.earned).toBe(false);
    expect(earnedCount({ streak: 30, memorized: 100, juz30Done: true, khatmahPct: 100, minutes: 600 })).toBe(7);
  });
});

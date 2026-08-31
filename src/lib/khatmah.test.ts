import { describe, expect, it } from 'vitest';
import { expectedByToday, pagesPerDay, progressPct, todaysRange } from './khatmah';

const plan = { startDate: '2026-08-01', days: 30, donePages: 0 };

describe('khatmah', () => {
  it('30-day plan ≈ 21 pages/day covering 604', () => {
    expect(pagesPerDay(30)).toBe(21);
  });
  it('day 0 range starts at page 1', () => {
    expect(todaysRange(plan, '2026-08-01')).toEqual({ from: 1, to: 21 });
  });
  it('day 2 range advances', () => {
    expect(todaysRange(plan, '2026-08-03')).toEqual({ from: 43, to: 63 });
  });
  it('clamps to last page near the end', () => {
    expect(expectedByToday(plan, '2026-09-30')).toBe(604);
  });
  it('progress percent', () => {
    expect(progressPct({ ...plan, donePages: 302 })).toBe(50);
  });
});

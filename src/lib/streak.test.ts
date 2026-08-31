import { describe, expect, it } from 'vitest';
import { computeStreak, recordDay } from './streak';

describe('streak', () => {
  it('counts consecutive days ending today', () => {
    expect(computeStreak(['2026-08-29', '2026-08-30', '2026-08-31'], '2026-08-31')).toBe(3);
  });
  it('breaks on a gap', () => {
    expect(computeStreak(['2026-08-25', '2026-08-30', '2026-08-31'], '2026-08-31')).toBe(2);
  });
  it('grace day: yesterday active, today not yet', () => {
    expect(computeStreak(['2026-08-29', '2026-08-30'], '2026-08-31')).toBe(2);
  });
  it('zero when inactive two days', () => {
    expect(computeStreak(['2026-08-01'], '2026-08-31')).toBe(0);
  });
  it('recordDay adds once, sorted', () => {
    expect(recordDay(['2026-08-30'], '2026-08-31')).toEqual(['2026-08-30', '2026-08-31']);
    expect(recordDay(['2026-08-31'], '2026-08-31')).toEqual(['2026-08-31']);
  });
});

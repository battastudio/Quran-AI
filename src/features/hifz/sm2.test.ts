import { describe, expect, it } from 'vitest';
import { schedule } from './sm2';

const START = { ease: 2.5, interval: 0, reps: 0 };

describe('sm2', () => {
  it('grows interval on good reviews', () => {
    const a = schedule(START, 5); // reps1 → 1d
    const b = schedule(a, 5); // reps2 → 6d
    const c = schedule(b, 5); // reps3 → interval*ease
    expect(a.interval).toBe(1);
    expect(b.interval).toBe(6);
    expect(c.interval).toBeGreaterThan(6);
    expect(c.ease).toBeGreaterThanOrEqual(2.5);
  });

  it('lapses to 1 day and resets reps on failure', () => {
    const good = schedule(schedule(START, 5), 4);
    const lapsed = schedule(good, 1);
    expect(lapsed.interval).toBe(1);
    expect(lapsed.reps).toBe(0);
  });

  it('never drops ease below 1.3', () => {
    let s = { ease: 1.3, interval: 10, reps: 5 };
    s = schedule(s, 3);
    expect(s.ease).toBeGreaterThanOrEqual(1.3);
  });
});

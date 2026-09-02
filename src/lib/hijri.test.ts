import { describe, expect, it } from 'vitest';
import { fastingReason, hijriLabel, hijriParts, upcomingEvents } from './hijri';

describe('hijri', () => {
  it('returns sane hijri parts', () => {
    const p = hijriParts(new Date(2026, 8, 2));
    expect(p.month).toBeGreaterThanOrEqual(1);
    expect(p.month).toBeLessThanOrEqual(12);
    expect(p.day).toBeGreaterThanOrEqual(1);
    expect(p.year).toBeGreaterThan(1400);
  });
  it('labels non-empty', () => expect(hijriLabel(new Date(2026, 8, 2)).length).toBeGreaterThan(3));
  it('marks Monday/Thursday as fasting', () => {
    // 2026-09-07 is a Monday
    expect(fastingReason(new Date(2026, 8, 7))).toBe('الاثنين');
  });
  it('lists upcoming events with non-negative offsets', () => {
    const e = upcomingEvents(new Date(2026, 8, 2), 3);
    expect(e.length).toBeGreaterThan(0);
    expect(e[0].inDays).toBeGreaterThanOrEqual(0);
  });
});

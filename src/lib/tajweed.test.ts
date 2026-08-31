import { describe, expect, it } from 'vitest';
import { parseTajweed, ruleColor } from './tajweed';

describe('tajweed', () => {
  it('splits marked text into plain + ruled segments', () => {
    const segs = parseTajweed('رَبِّ [h:4[ٱ]لْعَ[n[ـٰ]لَم');
    expect(segs[0]).toEqual({ text: 'رَبِّ ' });
    expect(segs[1]).toEqual({ text: 'ٱ', rule: 'hamzawasl' });
    expect(segs[2]).toEqual({ text: 'لْعَ' });
    expect(segs[3]).toEqual({ text: 'ـٰ', rule: 'madd' });
  });
  it('plain text yields one segment', () => {
    expect(parseTajweed('قُلْ')).toEqual([{ text: 'قُلْ' }]);
  });
  it('maps families to colors', () => {
    expect(ruleColor('qalqalah')).toBeTruthy();
    expect(ruleColor(undefined)).toBeUndefined();
  });
});

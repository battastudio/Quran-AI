import { describe, expect, it } from 'vitest';
import { normalize, tokens } from './normalize';

describe('normalize', () => {
  it('strips diacritics', () => {
    expect(normalize('الرَّحْمَٰنِ')).toBe('الرحمن');
  });
  it('unifies alef and taa marbuta', () => {
    expect(normalize('إِنَّ')).toBe('ان');
    expect(normalize('رَحْمَة')).toBe('رحمه');
  });
  it('tokenizes the basmala into four words', () => {
    expect(tokens('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ')).toEqual([
      'بسم',
      'الله',
      'الرحمن',
      'الرحيم',
    ]);
  });
});

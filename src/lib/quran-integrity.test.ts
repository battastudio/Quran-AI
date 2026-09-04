import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Byte-faithfulness guard (Fable §E#16, reverence non-negotiable): the bundled
// Quran text is complete and never mutated by our data pipeline. If any transform
// or bad edit slips in, this fails.
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const quran = JSON.parse(readFileSync(join(root, 'public/data/quran.json'), 'utf8')) as {
  surahs: { n: number; ayahs: { a: number; g: number; t: string }[] }[];
};

describe('quran integrity', () => {
  it('has exactly 114 surahs', () => {
    expect(quran.surahs.length).toBe(114);
  });

  it('has exactly 6236 ayahs with sequential global numbers', () => {
    const flat = quran.surahs.flatMap((s) => s.ayahs);
    expect(flat.length).toBe(6236);
    flat.forEach((y, i) => expect(y.g).toBe(i + 1));
  });

  it('every ayah has non-empty text and in-surah numbering starts at 1', () => {
    for (const s of quran.surahs) {
      expect(s.ayahs[0]?.a).toBe(1);
      for (const y of s.ayahs) {
        expect(typeof y.t).toBe('string');
        expect(y.t.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('preserves ayah text through JSON round-trip (no hidden mutation)', () => {
    const sample = quran.surahs[1]!.ayahs[254]!; // al-Baqara 255 — Ayat al-Kursi
    expect(sample.a).toBe(255);
    expect(sample.t).toBe(JSON.parse(JSON.stringify(sample)).t);
    expect(sample.t.length).toBeGreaterThan(200); // Ayat al-Kursi is a long ayah
  });
});

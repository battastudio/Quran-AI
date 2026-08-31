// Strip diacritics + unify letter forms so spoken text can be matched to the
// Uthmani script. Matching-only — never mutates or replaces the sacred text.
const DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/g;

export function normalize(text: string): string {
  return text
    .replace(DIACRITICS, '')
    .replace(/[إأآاٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[ؤئء]/g, '')
    .trim();
}

export function tokens(text: string): string[] {
  return normalize(text).split(/\s+/).filter(Boolean);
}

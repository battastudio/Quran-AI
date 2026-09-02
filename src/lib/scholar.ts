import { getScholarCache, putScholarCache } from './db';

// Per-ayah scholarly text from the spa5k tafsir_api (i'rab, gharib, extra tafsirs).
// Fetched once per ayah, cached in IndexedDB → offline after.
const CDN = 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir';

export const IRAB = 'al-i-rab-al-muyassar';
export const GHARIB = 'asseraj-fi-bayan-gharib-alquran';
export const SPA_TAFSIRS = [
  { id: 'ar-tafsir-ibn-kathir', name: 'ابن كثير' },
  { id: 'ar-tafsir-al-tabari', name: 'الطبري' },
  { id: 'ar-tafsir-as-saadi', name: 'السعدي' },
  { id: 'ar-tafseer-al-qurtubi', name: 'القرطبي' },
  { id: 'ar-tafsir-al-baghawi', name: 'البغوي' },
];
export const isSpaSlug = (id: string) => id.startsWith('ar-') || id.startsWith('al-') || id.startsWith('asseraj');

export async function scholarText(slug: string, surah: number, ayah: number): Promise<string | null> {
  const key = `${slug}:${surah}:${ayah}`;
  const cached = await getScholarCache(key);
  if (cached !== undefined) return cached;
  try {
    const res = await fetch(`${CDN}/${slug}/${surah}/${ayah}.json`);
    if (!res.ok) return null;
    const text = ((await res.json()) as { text?: string }).text ?? '';
    await putScholarCache(key, text);
    return text;
  } catch {
    return null;
  }
}

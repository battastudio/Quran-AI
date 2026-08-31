import type { Surah, SurahMeta } from './types';
import { getTafsirDownload, putTafsirDownload } from './db';

const BASE = import.meta.env.BASE_URL;

async function fetchJson<T>(file: string): Promise<T> {
  const res = await fetch(`${BASE}data/${file}`);
  if (!res.ok) throw new Error(`load ${file}: ${res.status}`);
  return res.json() as Promise<T>;
}

let listCache: SurahMeta[] | null = null;
let quranCache: Surah[] | null = null;
let muyassarCache: Record<string, string> | null = null;

export async function surahList(): Promise<SurahMeta[]> {
  if (!listCache) listCache = await fetchJson<SurahMeta[]>('surahs.json');
  return listCache;
}

async function allSurahs(): Promise<Surah[]> {
  if (!quranCache) quranCache = (await fetchJson<{ surahs: Surah[] }>('quran.json')).surahs;
  return quranCache;
}

export async function getSurah(n: number): Promise<Surah | undefined> {
  return (await allSurahs()).find((s) => s.n === n);
}

export interface FlatAyah {
  s: number;
  a: number;
  t: string;
}

let flatCache: FlatAyah[] | null = null;
export async function allAyahsFlat(): Promise<FlatAyah[]> {
  if (!flatCache)
    flatCache = (await allSurahs()).flatMap((s) => s.ayahs.map((y) => ({ s: s.n, a: y.a, t: y.t })));
  return flatCache;
}

// Split an ayah into whitespace-delimited tokens (each is a tappable word).
export function words(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

// First ayah on a given mushaf page (for khatmah "read today's pages").
export async function firstAyahOfPage(page: number): Promise<{ surah: number; ayah: number }> {
  for (const s of await allSurahs()) {
    const y = s.ayahs.find((a) => a.p >= page);
    if (y) return { surah: s.n, ayah: y.a };
  }
  return { surah: 1, ayah: 1 };
}

async function muyassar(): Promise<Record<string, string>> {
  if (!muyassarCache) muyassarCache = await fetchJson<Record<string, string>>('tafsir-muyassar.json');
  return muyassarCache;
}

// Tafsir text for an ayah from the active book. 'muyassar' is bundled; other
// ids are runtime-downloaded editions cached in IndexedDB.
export async function tafsirFor(bookId: string, surah: number, ayah: number): Promise<string | null> {
  const key = `${surah}:${ayah}`;
  if (bookId === 'muyassar') return (await muyassar())[key] ?? null;
  const dl = await getTafsirDownload(bookId);
  return dl?.data[key] ?? null;
}

// Download a full tafsir edition from AlQuran Cloud → IndexedDB (offline after).
export async function downloadTafsir(bookId: string): Promise<void> {
  const res = await fetch(`https://api.alquran.cloud/v1/quran/${bookId}`);
  if (!res.ok) throw new Error(`download ${bookId}: ${res.status}`);
  const body = await res.json();
  if (body.code !== 200) throw new Error(`download ${bookId}: bad payload`);
  const map: Record<string, string> = {};
  for (const s of body.data.surahs)
    for (const a of s.ayahs) map[`${s.number}:${a.numberInSurah}`] = a.text;
  await putTafsirDownload(bookId, map);
}

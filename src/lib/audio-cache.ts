import { ayahAudioUrl } from './audio-url';
import { getKv, setKv } from './db';

const listKey = (reciter: string) => `audioSurahs:${reciter}`;

export async function downloadedSurahs(reciter: string): Promise<number[]> {
  return (await getKv<number[]>(listKey(reciter))) ?? [];
}

async function mark(reciter: string, surah: number, on: boolean) {
  const set = new Set(await downloadedSurahs(reciter));
  if (on) set.add(surah);
  else set.delete(surah);
  await setKv(listKey(reciter), [...set].sort((a, b) => a - b));
}

// Prefetch every ayah mp3 so the service worker caches them (offline playback).
export async function downloadSurah(
  reciter: string,
  surah: number,
  count: number,
  onProgress: (done: number, total: number) => void,
): Promise<void> {
  for (let a = 1; a <= count; a++) {
    try {
      await fetch(ayahAudioUrl(reciter, surah, a), { mode: 'no-cors' });
    } catch {
      /* offline / blocked — skip; playback retries when online */
    }
    onProgress(a, count);
  }
  await mark(reciter, surah, true);
}

// Remove this surah's audio from every cache (cache name is workbox-managed).
export async function deleteSurah(reciter: string, surah: number, count: number): Promise<void> {
  for (const name of await caches.keys()) {
    const cache = await caches.open(name);
    for (let a = 1; a <= count; a++) await cache.delete(ayahAudioUrl(reciter, surah, a));
  }
  await mark(reciter, surah, false);
}

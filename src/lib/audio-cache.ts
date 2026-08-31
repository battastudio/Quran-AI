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

// Prefetch every ayah mp3 (by global number) so the SW caches them for offline.
export async function downloadSurah(
  reciter: string,
  surah: number,
  gs: number[],
  bitrate: number,
  onProgress: (done: number, total: number) => void,
): Promise<void> {
  for (let i = 0; i < gs.length; i++) {
    try {
      await fetch(ayahAudioUrl(reciter, gs[i], bitrate), { mode: 'no-cors' });
    } catch {
      /* offline / blocked — skip; playback retries when online */
    }
    onProgress(i + 1, gs.length);
  }
  await mark(reciter, surah, true);
}

export async function deleteSurah(reciter: string, surah: number, gs: number[], bitrate: number): Promise<void> {
  for (const name of await caches.keys()) {
    const cache = await caches.open(name);
    for (const g of gs) await cache.delete(ayahAudioUrl(reciter, g, bitrate));
  }
  await mark(reciter, surah, false);
}

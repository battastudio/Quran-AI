const pad = (n: number) => String(n).padStart(3, '0');

// everyayah.com/data/<reciter>/<sss><aaa>.mp3
export function ayahAudioUrl(reciter: string, surah: number, ayah: number): string {
  return `https://everyayah.com/data/${reciter}/${pad(surah)}${pad(ayah)}.mp3`;
}

// Per-word pronunciation. pos = 1-based word index within the ayah.
// audio.qurancdn.com/wbw/<sss>_<aaa>_<www>.mp3
export function wordAudioUrl(surah: number, ayah: number, pos: number): string {
  return `https://audio.qurancdn.com/wbw/${pad(surah)}_${pad(ayah)}_${pad(pos)}.mp3`;
}

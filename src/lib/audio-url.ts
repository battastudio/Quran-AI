const pad = (n: number) => String(n).padStart(3, '0');

// Ayah recitation — cdn.islamic.network, 176 Arabic editions, global ayah number.
// https://cdn.islamic.network/quran/audio/<bitrate>/<edition>/<g>.mp3
export function ayahAudioUrl(edition: string, g: number, bitrate = 128): string {
  return `https://cdn.islamic.network/quran/audio/${bitrate}/${edition}/${g}.mp3`;
}

// Per-word pronunciation (Quran.com wbw CDN). pos = 1-based word index.
export function wordAudioUrl(surah: number, ayah: number, pos: number): string {
  return `https://audio.qurancdn.com/wbw/${pad(surah)}_${pad(ayah)}_${pad(pos)}.mp3`;
}

// Alafasy audio matching the bundled word-timing segments (for word-sync highlight).
export function syncAudioUrl(surah: number, ayah: number): string {
  return `https://verses.quran.com/Alafasy/mp3/${pad(surah)}${pad(ayah)}.mp3`;
}

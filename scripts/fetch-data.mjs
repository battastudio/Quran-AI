// Build-time data fetch. Run once: `node scripts/fetch-data.mjs`.
// Writes verified Quran text + Muyassar tafsir + metadata into public/data/ so
// the app reads bundled JSON at runtime and works fully offline.
// Sacred text source: AlQuran Cloud (King Fahd Complex editions). Never edited.
import { mkdir, writeFile } from 'node:fs/promises';

const API = 'https://api.alquran.cloud/v1';
const OUT = new URL('../public/data/', import.meta.url);

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const body = await res.json();
  if (body.code !== 200) throw new Error(`bad payload ${url}`);
  return body.data;
}

const clean = (s) => s.replace(/^﻿/, '').trim();

async function main() {
  await mkdir(OUT, { recursive: true });

  console.log('fetching quran-uthmani…');
  const quran = await getJson(`${API}/quran/quran-uthmani`);
  const surahs = quran.surahs.map((s) => ({
    n: s.number,
    name: s.name,
    ename: s.englishName,
    type: s.revelationType === 'Meccan' ? 'مكية' : 'مدنية',
    count: s.numberOfAyahs,
    page: s.ayahs[0].page,
    ayahs: s.ayahs.map((a) => ({ a: a.numberInSurah, g: a.number, t: clean(a.text), p: a.page, j: a.juz })),
  }));

  // reader payload (with ayahs) + light index (no ayahs, for lists)
  await writeFile(new URL('quran.json', OUT), JSON.stringify({ surahs }));
  const index = surahs.map(({ ayahs, ...meta }) => (void ayahs, meta));
  await writeFile(new URL('surahs.json', OUT), JSON.stringify(index));

  console.log('fetching ar.muyassar tafsir…');
  const tafsir = await getJson(`${API}/quran/ar.muyassar`);
  const muyassar = {};
  for (const s of tafsir.surahs)
    for (const a of s.ayahs) muyassar[`${s.number}:${a.numberInSurah}`] = clean(a.text);
  await writeFile(new URL('tafsir-muyassar.json', OUT), JSON.stringify(muyassar));

  console.log('fetching quran-tajweed (colored) …');
  const tj = await getJson(`${API}/quran/quran-tajweed`);
  const tajweed = {};
  for (const s of tj.surahs) for (const a of s.ayahs) tajweed[`${s.number}:${a.numberInSurah}`] = a.text;
  await writeFile(new URL('quran-tajweed.json', OUT), JSON.stringify(tajweed));

  console.log('fetching adhkar (Hisn al-Muslim) …');
  const raw = await (await fetch('https://raw.githubusercontent.com/rn0x/Adhkar-json/main/adhkar.json')).json();
  const adhkar = raw
    .filter((c) => Array.isArray(c.array) && c.array.length)
    .map((c) => ({ title: c.category, items: c.array.map((x) => clean(x.text)) }));
  await writeFile(new URL('adhkar.json', OUT), JSON.stringify(adhkar));

  // All Arabic reciters (audio via cdn.islamic.network/quran/audio/<bitrate>/<id>/<g>.mp3)
  console.log('fetching reciter (audio) editions…');
  const audio = await getJson(`${API}/edition?format=audio&language=ar`);
  const reciters = audio.map((e) => ({ id: e.identifier, name: e.name }));
  await writeFile(new URL('reciters.json', OUT), JSON.stringify(reciters));

  // All Arabic tafsirs (muyassar bundled; rest downloadable at runtime).
  console.log('fetching tafsir editions…');
  const tafsirEds = await getJson(`${API}/edition?type=tafsir&language=ar`);
  const catalog = tafsirEds
    .filter((e) => e.identifier !== 'ar.muyassar')
    .map((e) => ({ id: e.identifier, name: e.name }));
  await writeFile(new URL('tafsir-catalog.json', OUT), JSON.stringify(catalog));

  console.log(`done: ${surahs.length} surahs, ${reciters.length} reciters, ${catalog.length + 1} tafsirs, ${adhkar.length} adhkar`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

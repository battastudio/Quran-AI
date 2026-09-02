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

  console.log('fetching word morphology (root/lemma/pos)…');
  const morphTxt = await (await fetch('https://raw.githubusercontent.com/mustafa0x/quran-morphology/master/quran-morphology.txt')).text();
  const morph = {};
  for (const line of morphTxt.split('\n')) {
    const [loc, , pos, feats] = line.split('\t');
    if (!loc || !feats) continue;
    const [s, a, w] = loc.split(':');
    const root = (feats.match(/ROOT:([^|]+)/) || [])[1];
    const lem = (feats.match(/LEM:([^|]+)/) || [])[1];
    if (!root && !lem) continue;
    const key = `${s}:${a}:${w}`;
    if (!morph[key]) morph[key] = { r: root || '', l: lem || '', p: pos };
    else if (root && !morph[key].r) { morph[key].r = root; morph[key].p = pos; }
  }
  await writeFile(new URL('word-morphology.json', OUT), JSON.stringify(morph));

  console.log('fetching Alafasy word-timing segments (114 chapters)…');
  const segments = {};
  for (let n = 1; n <= 114; n++) {
    const res = await (await fetch(`https://api.quran.com/api/v4/recitations/7/by_chapter/${n}?fields=segments&per_page=300`)).json();
    for (const f of res.audio_files || []) {
      segments[f.verse_key] = (f.segments || []).map((seg) => [seg[0], seg[2], seg[3]]);
    }
  }
  await writeFile(new URL('segments-alafasy.json', OUT), JSON.stringify(segments));

  console.log('fetching 99 names…');
  const asmaRes = await (await fetch('https://api.aladhan.com/v1/asmaAlHusna')).json();
  const asma = (asmaRes.data || []).map((x) => ({ n: x.number, name: x.name, t: x.transliteration }));
  await writeFile(new URL('asma.json', OUT), JSON.stringify(asma));

  await writeFile(new URL('duas.json', OUT), JSON.stringify(DUAS));

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

// Well-known Quranic supplications (references only; text comes from quran.json).
const DUAS = [
  { title: 'ربنا آتنا في الدنيا حسنة', s: 2, a: 201 },
  { title: 'ربنا لا تؤاخذنا إن نسينا', s: 2, a: 286 },
  { title: 'ربنا لا تزغ قلوبنا', s: 3, a: 8 },
  { title: 'ربنا إننا آمنا فاغفر لنا', s: 3, a: 16 },
  { title: 'ربنا اغفر لنا ذنوبنا', s: 3, a: 147 },
  { title: 'حسبنا الله ونعم الوكيل', s: 3, a: 173 },
  { title: 'رب هب لي من لدنك ذرية طيبة', s: 3, a: 38 },
  { title: 'ربنا آتنا من لدنك رحمة', s: 18, a: 10 },
  { title: 'رب اشرح لي صدري', s: 20, a: 25 },
  { title: 'رب زدني علما', s: 20, a: 114 },
  { title: 'رب أعوذ بك من همزات الشياطين', s: 23, a: 97 },
  { title: 'ربنا هب لنا من أزواجنا قرة أعين', s: 25, a: 74 },
  { title: 'رب أوزعني أن أشكر نعمتك', s: 27, a: 19 },
  { title: 'رب إني لما أنزلت إلي من خير فقير', s: 28, a: 24 },
  { title: 'رب اجعلني مقيم الصلاة', s: 14, a: 40 },
  { title: 'ربنا وسعت كل شيء رحمة وعلما', s: 40, a: 7 },
];

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

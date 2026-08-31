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
    ayahs: s.ayahs.map((a) => ({ a: a.numberInSurah, t: clean(a.text), p: a.page, j: a.juz })),
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

  await writeFile(new URL('reciters.json', OUT), JSON.stringify(RECITERS));
  await writeFile(new URL('tafsir-catalog.json', OUT), JSON.stringify(TAFSIRS));

  console.log(`done: ${surahs.length} surahs, ${Object.keys(muyassar).length} tafsir entries`);
}

// everyayah.com/data/<folder>/<sss><aaa>.mp3
const RECITERS = [
  { id: 'Alafasy_128kbps', name: 'مشاري العفاسي' },
  { id: 'Husary_128kbps', name: 'محمود خليل الحصري' },
  { id: 'Abdul_Basit_Murattal_192kbps', name: 'عبد الباسط عبد الصمد (مرتل)' },
  { id: 'Minshawy_Murattal_128kbps', name: 'محمد صديق المنشاوي (مرتل)' },
  { id: 'Abdurrahmaan_As-Sudais_192kbps', name: 'عبد الرحمن السديس' },
  { id: 'Abu_Bakr_Ash-Shaatree_128kbps', name: 'أبو بكر الشاطري' },
];

// Downloadable at runtime: GET api.alquran.cloud/v1/quran/<id> → cache in IndexedDB.
const TAFSIRS = [
  { id: 'ar.jalalayn', name: 'تفسير الجلالين' },
  { id: 'ar.qurtubi', name: 'تفسير القرطبي' },
  { id: 'ar.waseet', name: 'التفسير الوسيط' },
  { id: 'ar.miqbas', name: 'تنوير المقباس (ابن عباس)' },
];

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

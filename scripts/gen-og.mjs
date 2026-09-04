// Generate static Open Graph pages for shared deep links so link previews show the
// ayah (crawlers can't run the SPA). Output: public/og/{surah}-{ayah}.html — each is a
// tiny page with OG tags that redirects humans to the app deep link.
// Run: node scripts/gen-og.mjs   (also run in the build/predeploy step)
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://battastudio.github.io/Quran-AI';
const quran = JSON.parse(readFileSync(join(root, 'public/data/quran.json'), 'utf8'));

// which ayahs get a prerendered OG page: every surah opener + a curated famous set.
const FAMOUS = [[2, 255], [2, 286], [1, 1], [36, 1], [55, 13], [112, 1], [18, 10], [3, 26], [94, 5]];
const targets = new Map();
for (const s of quran.surahs) targets.set(`${s.n}-1`, [s.n, 1]);
for (const [s, a] of FAMOUS) targets.set(`${s}-${a}`, [s, a]);

const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ayahText = (s, a) => quran.surahs.find((x) => x.n === s)?.ayahs.find((y) => y.a === a)?.t ?? '';
const surahName = (s) => quran.surahs.find((x) => x.n === s)?.name ?? `سورة ${s}`;

const outDir = join(root, 'public/og');
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

let n = 0;
for (const [key, [s, a]] of targets) {
  const text = ayahText(s, a);
  if (!text) continue;
  const title = `${surahName(s)} — الآية ${a} · نور القرآن`;
  const desc = text.length > 160 ? text.slice(0, 157) + '…' : text;
  const deep = `${BASE}/#/s/${s}/${a}`;
  const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${deep}">
<meta property="og:site_name" content="نور القرآن">
<meta name="twitter:card" content="summary">
<meta http-equiv="refresh" content="0; url=${deep}">
<link rel="canonical" href="${deep}"></head>
<body><p><a href="${deep}">افتح الآية في نور القرآن</a></p></body></html>`;
  writeFileSync(join(outDir, `${key}.html`), html);
  n++;
}
console.log(`gen-og: wrote ${n} OG pages to public/og/`);

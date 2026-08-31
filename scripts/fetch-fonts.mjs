// Download self-hosted woff2 (Arabic subsets) for offline use. Run once.
// Source: Google Fonts (Amiri Quran, IBM Plex Sans Arabic) — open-licensed (OFL).
import { mkdir, writeFile } from 'node:fs/promises';

const OUT = new URL('../public/fonts/', import.meta.url);
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

const FAMILIES = [
  { css: 'Amiri+Quran', out: 'amiri-quran' },
  { css: 'IBM+Plex+Sans+Arabic:wght@400;600;700', out: 'ibm-plex-arabic' },
];

await mkdir(OUT, { recursive: true });

for (const fam of FAMILIES) {
  const url = `https://fonts.googleapis.com/css2?family=${fam.css}&display=swap`;
  const css = await (await fetch(url, { headers: { 'User-Agent': UA } })).text();
  const blocks = css.split('@font-face').slice(1);
  let n = 0;
  for (const b of blocks) {
    if (!/unicode-range:[^;]*0600/i.test(b)) continue; // arabic subset only
    const weight = (b.match(/font-weight:\s*(\d+)/) || [])[1] || '400';
    const src = (b.match(/url\((https:[^)]+\.woff2)\)/) || [])[1];
    if (!src) continue;
    const buf = Buffer.from(await (await fetch(src)).arrayBuffer());
    const file = `${fam.out}-${weight}.woff2`;
    await writeFile(new URL(file, OUT), buf);
    console.log(`wrote ${file} (${(buf.length / 1024) | 0} KB)`);
    n++;
  }
  if (!n) console.warn(`! no arabic woff2 found for ${fam.css}`);
}

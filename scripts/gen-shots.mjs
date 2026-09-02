// Generate branded promo screenshots for the PWA manifest / store listing.
// Replace with real device screenshots before publishing (see docs/STORE.md).
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const shots = [
  { file: 'screenshot-1.png', title: 'نور القرآن', sub: 'مصحف يعمل دون إنترنت — قراءة وتلاوة وتفسير' },
  { file: 'screenshot-2.png', title: 'تلاوة وتسميع', sub: '١٧٦ قارئًا · تظليل الكلمات · حفظ ومراجعة' },
];

for (const s of shots) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0e3327"/><stop offset="1" stop-color="#08221a"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#g)"/>
    <rect x="90" y="120" width="900" height="900" rx="40" fill="none" stroke="#c9a54a" stroke-width="3"/>
    <text x="540" y="1200" text-anchor="middle" font-family="serif" font-size="96" fill="#f7f3e3">${s.title}</text>
    <text x="540" y="1300" text-anchor="middle" font-family="sans-serif" font-size="42" fill="#9dc4b2">${s.sub}</text>
  </svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  await writeFile(new URL(`../public/${s.file}`, import.meta.url), png);
  console.log('wrote', s.file);
}

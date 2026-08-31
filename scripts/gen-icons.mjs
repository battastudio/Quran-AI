// Rasterize public/icon.svg → PNG launcher icons. Run: node scripts/gen-icons.mjs
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const svg = await readFile(new URL('../public/icon.svg', import.meta.url));
const OUT = new URL('../public/', import.meta.url);

const sizes = [
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'icon-512-maskable.png', size: 512 }, // full-bleed bg → safe as maskable
  { file: 'apple-touch-icon.png', size: 180 },
];

for (const { file, size } of sizes) {
  const png = await sharp(svg).resize(size, size).png().toBuffer();
  await writeFile(new URL(file, OUT), png);
  console.log(`wrote ${file} (${size}px)`);
}

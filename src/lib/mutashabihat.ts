import { allAyahsFlat } from './quran';
import { tokens } from './normalize';

// Similar-ayah finder: ayahs sharing a ≥4-word phrase (for memorization).
let shingles: Map<string, number[]> | null = null;
let flat: { s: number; a: number }[] = [];

const grams = (ws: string[]) => {
  const out: string[] = [];
  for (let i = 0; i + 4 <= ws.length; i++) out.push(ws.slice(i, i + 4).join(' '));
  return out;
};

async function build() {
  if (shingles) return;
  shingles = new Map();
  const all = await allAyahsFlat();
  flat = all.map((x) => ({ s: x.s, a: x.a }));
  all.forEach((x, i) => {
    for (const g of grams(tokens(x.t))) (shingles!.get(g) ?? shingles!.set(g, []).get(g)!).push(i);
  });
}

export async function similarAyahs(surah: number, ayah: number): Promise<{ s: number; a: number }[]> {
  await build();
  const all = await allAyahsFlat();
  const idx = all.findIndex((x) => x.s === surah && x.a === ayah);
  if (idx < 0) return [];
  const found = new Set<number>();
  for (const g of grams(tokens(all[idx].t)))
    for (const j of shingles!.get(g) ?? []) if (j !== idx) found.add(j);
  return [...found].slice(0, 30).map((i) => flat[i]);
}

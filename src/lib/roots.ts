import { morphologyMap } from './quran';

// Root → ayah occurrences, built once from the bundled morphology.
let index: Map<string, { s: number; a: number }[]> | null = null;

export async function rootOccurrences(root: string): Promise<{ s: number; a: number }[]> {
  if (!index) {
    const m = await morphologyMap();
    index = new Map();
    for (const [k, v] of Object.entries(m)) {
      if (!v.r) continue;
      const [s, a] = k.split(':').map(Number);
      const arr = index.get(v.r) ?? [];
      const last = arr[arr.length - 1];
      if (!last || last.s !== s || last.a !== a) arr.push({ s, a }); // dedupe per ayah
      index.set(v.r, arr);
    }
  }
  return index.get(root) ?? [];
}

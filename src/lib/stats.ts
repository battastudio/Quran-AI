import { getKv, setKv } from './db';
import { dayKey } from './streak';

// Madani-mushaf start page of each juz (+605 sentinel).
export const JUZ_START = [
  1, 22, 42, 62, 82, 102, 121, 142, 162, 182, 201, 222, 242, 262, 282, 302, 322,
  342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582, 605,
];

// Percent of a juz's pages that have been read (juz 0-based).
export function juzPercent(readPages: Set<number>, juz: number): number {
  const from = JUZ_START[juz];
  const to = JUZ_START[juz + 1] - 1;
  let read = 0;
  for (let p = from; p <= to; p++) if (readPages.has(p)) read++;
  return Math.round((read / (to - from + 1)) * 100);
}

// Calendar grid (weeks × 7) of active/inactive days ending today.
export function streakGrid(days: string[], weeks: number, today = dayKey()): boolean[][] {
  const set = new Set(days);
  const end = new Date(today).getTime();
  const cells: boolean[] = [];
  for (let i = weeks * 7 - 1; i >= 0; i--) cells.push(set.has(dayKey(new Date(end - i * 86_400_000))));
  const grid: boolean[][] = [];
  for (let w = 0; w < weeks; w++) grid.push(cells.slice(w * 7, w * 7 + 7));
  return grid;
}

// ---- persistence (side effects) ----
export async function addReadingMinute(): Promise<void> {
  const key = `minutes:${dayKey()}`;
  await setKv(key, ((await getKv<number>(key)) ?? 0) + 1);
}
export async function markPageRead(page: number): Promise<void> {
  const pages = new Set((await getKv<number[]>('readPages')) ?? []);
  if (pages.has(page)) return;
  pages.add(page);
  await setKv('readPages', [...pages]);
}
export async function readMinutes(): Promise<{ today: number; total: number }> {
  const today = (await getKv<number>(`minutes:${dayKey()}`)) ?? 0;
  // total across all recorded days
  let total = 0;
  const days = (await getKv<string[]>('streakDays')) ?? [];
  for (const d of days) total += (await getKv<number>(`minutes:${d}`)) ?? 0;
  return { today, total: total || today };
}
export async function readPagesSet(): Promise<Set<number>> {
  return new Set((await getKv<number[]>('readPages')) ?? []);
}

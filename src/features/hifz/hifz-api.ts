import { allHifz, deleteHifz, putHifz } from '../../lib/db';
import type { HifzCard } from '../../lib/types';
import { schedule } from './sm2';

const DAY = 86_400_000;

export async function memorizeAyah(surah: number, ayah: number): Promise<void> {
  const key = `${surah}:${ayah}`;
  await putHifz({ key, surah, ayah, ease: 2.5, interval: 0, due: Date.now(), reps: 0 });
}

export async function memorizeRange(surah: number, from: number, to: number): Promise<void> {
  for (let a = from; a <= to; a++) await memorizeAyah(surah, a);
}

export async function gradeCard(card: HifzCard, quality: number): Promise<void> {
  const s = schedule(card, quality);
  await putHifz({ ...card, ...s, due: Date.now() + s.interval * DAY });
}

export async function dueCards(): Promise<HifzCard[]> {
  const now = Date.now();
  return (await allHifz()).filter((c) => c.due <= now).sort((a, b) => a.due - b.due);
}

export async function allCards(): Promise<HifzCard[]> {
  return allHifz();
}

export async function forget(key: string): Promise<void> {
  await deleteHifz(key);
}

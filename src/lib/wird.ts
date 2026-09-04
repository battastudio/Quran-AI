// Wird engine — resolves "today's reading" from the khatmah plan, else a gentle
// 1-page/day fallback. Pure-ish (reads idb); used by Home and the #/today deep link.
import { firstAyahOfPage } from './quran';
import { getKv } from './db';
import { dayKey } from './streak';
import { todaysRange, type KhatmahPlan } from './khatmah';

export interface TodayWird { from: number; to: number; done: number; total: number }

export async function selectTodayWird(): Promise<TodayWird | null> {
  const plan = await getKv<KhatmahPlan>('khatmah');
  if (!plan) return null;
  const { from, to } = todaysRange(plan, dayKey());
  const total = Math.max(1, to - from + 1);
  const done = Math.max(0, Math.min(total, plan.donePages - (from - 1)));
  return { from, to, done, total };
}

/** The ayah to open for «ورد اليوم» / #/today: start of today's range, else al-Fatiha. */
export async function todayAyah(): Promise<{ surah: number; ayah: number }> {
  const w = await selectTodayWird();
  if (w) return firstAyahOfPage(w.from);
  return { surah: 1, ayah: 1 };
}

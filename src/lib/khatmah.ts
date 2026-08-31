// Khatmah (finish-the-Quran) plan over the 604-page mushaf. Pure scheduling.
export const MUSHAF_PAGES = 604;
const DAY = 86_400_000;

export interface KhatmahPlan {
  startDate: string; // 'YYYY-MM-DD'
  days: number;
  donePages: number; // pages completed so far
}

export function pagesPerDay(days: number): number {
  return Math.ceil(MUSHAF_PAGES / Math.max(1, days));
}

export function dayIndex(startDate: string, today: string): number {
  const diff = new Date(today).getTime() - new Date(startDate).getTime();
  return Math.max(0, Math.floor(diff / DAY));
}

// Pages assigned for a given day (1-based page numbers, inclusive).
export function todaysRange(plan: KhatmahPlan, today: string): { from: number; to: number } {
  const ppd = pagesPerDay(plan.days);
  const i = dayIndex(plan.startDate, today);
  const from = Math.min(MUSHAF_PAGES, i * ppd + 1);
  const to = Math.min(MUSHAF_PAGES, (i + 1) * ppd);
  return { from, to };
}

// Target pages that should be done by end of today (for on-track check).
export function expectedByToday(plan: KhatmahPlan, today: string): number {
  return Math.min(MUSHAF_PAGES, (dayIndex(plan.startDate, today) + 1) * pagesPerDay(plan.days));
}

export function progressPct(plan: KhatmahPlan): number {
  return Math.round((Math.min(plan.donePages, MUSHAF_PAGES) / MUSHAF_PAGES) * 100);
}

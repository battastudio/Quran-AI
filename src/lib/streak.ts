// Reading streak from a set of active day keys ('YYYY-MM-DD').
const DAY = 86_400_000;

export function dayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function recordDay(days: string[], today = dayKey()): string[] {
  return days.includes(today) ? days : [...days, today].sort();
}

// Consecutive days ending today (or yesterday, as a grace day).
export function computeStreak(days: string[], today = dayKey()): number {
  const set = new Set(days);
  let cursor = new Date(today).getTime();
  if (!set.has(today)) {
    cursor -= DAY; // allow the streak to hold until end of the next day
    if (!set.has(dayKey(new Date(cursor)))) return 0;
  }
  let streak = 0;
  while (set.has(dayKey(new Date(cursor)))) {
    streak++;
    cursor -= DAY;
  }
  return streak;
}

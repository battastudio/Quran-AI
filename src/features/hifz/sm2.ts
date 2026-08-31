export interface Sched {
  ease: number;
  interval: number; // days
  reps: number;
}

// SM-2 spaced repetition. quality 0..5; <3 = lapse (restart). Returns next schedule.
export function schedule(prev: Sched, quality: number): Sched {
  let { ease, interval, reps } = prev;
  if (quality < 3) {
    return { ease, interval: 1, reps: 0 };
  }
  reps += 1;
  if (reps === 1) interval = 1;
  else if (reps === 2) interval = 6;
  else interval = Math.round(interval * ease);
  ease = Math.max(1.3, ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  return { ease, interval, reps };
}

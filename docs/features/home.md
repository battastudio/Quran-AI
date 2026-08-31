# Home dashboard

`src/features/home/` — the landing tab (`/`). Reader moved to `/mushaf`.

Cards (each links to its screen):
- **Continue reading** — from `lastRead` (reader-store) → jumps to the ayah.
- **Hifz review** — count of `dueCards()` today.
- **Streak 🔥** — `computeStreak` over `streakDays` (recorded on each read via
  `src/lib/streak.ts`, tested).
- **Next prayer** — from cached coords + `computeTimes`.
- **Khatmah** — current plan days or "start".
- **Tasmi' / Search** — quick actions.
- **Verse of the day** — `verse-of-day.tsx`, deterministic by day-of-year.

Offline: fully (all local except next-prayer needs a prior location fix).

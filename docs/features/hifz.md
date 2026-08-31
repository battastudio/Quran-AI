# Memorization (Hifz, SM-2)

`src/features/hifz/` — spaced-repetition memorization.

- **Engine:** `sm2.ts` — pure SM-2 `schedule(prev, quality)` (quality 0–5, <3 =
  lapse). Covered by `sm2.test.ts`.
- **API:** `hifz-api.ts` — `memorizeAyah` / `memorizeRange` create cards due now;
  `gradeCard` reschedules (`due = now + interval days`); `dueCards` returns the
  review queue. Cards live in IndexedDB `hifz` store (`HifzCard`).
- **Screen:** `hifz-screen.tsx` — dashboard (memorized count, due today) + review
  flow: shows the reference, reveal the ayah, grade نسيت/صعب/جيد/سهل.
- **Add to memorization** from the reader's ＋ action on any ayah.

Offline: fully — all state is local.

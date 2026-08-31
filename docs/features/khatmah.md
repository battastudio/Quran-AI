# Khatmah (reading plan)

`src/features/khatmah/` + `src/lib/khatmah.ts` (pure, tested).

- Choose a duration (7/15/30/60 days). Plan = `{ startDate, days, donePages }`
  in IndexedDB (`khatmah` kv).
- `todaysRange(plan, today)` computes today's page range over the 604-page mushaf;
  "اقرأ ورد اليوم" jumps the reader to the first ayah of that page
  (`firstAyahOfPage`). "تم" marks today done; `progressPct` shows overall progress.
- Surfaced on the Home dashboard.

Offline: fully.

# Search & go-to

`src/features/search/` — `/search` (from Home or the Mushaf 🔍 header button).

- Lazy-builds a normalized index over all 6236 ayahs (`allAyahsFlat` +
  `normalize`), so search is **diacritic-insensitive** (type «الرحمن», matches
  «ٱلرَّحْمَٰن»).
- Results (capped at 60) → tapping calls `reader.goTo(surah, ayah)` and navigates
  to `/mushaf`, which scrolls to and flashes the target ayah (`targetAyah` in
  `reader-store.ts`, handled in `surah-view.tsx`).

Offline: fully — index is built from bundled text.

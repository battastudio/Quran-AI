# Reader (Interactive Mushaf) — multiple views

`src/features/reader/` — `settings.readerView` picks the view; switch in the reader
header or set a default in Settings → المظهر والعرض.

- **scroll** (`surah-view.tsx`) — vertical scroll of a surah; tappable words, per-ayah
  actions (play · tafsir · bookmark · note · share · memorize), tajwīd coloring.
- **page** (`mushaf-page-view.tsx`) — ayahs grouped by mushaf page (`ayah.p`),
  swipe/tap between pages (framer-motion), page + juz header.
- **focus** (`focus-view.tsx`) — distraction-free, one large ayah, tap to advance.
- **cards** (`ayah-cards-view.tsx`) — one swipeable ayah card + its tafsir.

Data: `src/lib/quran.ts` (`getSurah`, `words`, `firstAyahOfPage`, `tafsirFor`,
`tajweedFor`). Ayah text renders in the **Amiri Quran** font (toggle to system in
Settings). Offline: fully.

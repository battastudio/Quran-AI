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

## Swipe & resume
- **Swipe between surahs** (`surah-swipe.tsx`) on scroll/focus/cards, and between
  **pages** in page mode; direction (RTL/LTR) is a setting (`swipeDir`). Page mode
  rolls over to the next/prev surah at the ends.
- **Accurate resume:** `SurahView` tracks the centred ayah (IntersectionObserver);
  page/focus/cards mark on change → `reader-store.markRead`. Home «متابعة القراءة»
  returns to the exact ayah.
- **Manual marker:** the ★ button in the reader header (`reader-store.setMark`)
  saves your place; Home shows «العودة إلى العلامة».

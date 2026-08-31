# Reader (Interactive Mushaf)

`src/features/reader/` — surah view with tappable words and per-ayah actions.

- **Data:** `src/lib/quran.ts` loads bundled `public/data/quran.json` (Uthmani,
  all 114 surahs) with an in-memory cache; `surahs.json` is the light index.
- **Screen:** `reader-screen.tsx` — surah title opens `surah-picker.tsx`; ▶ plays
  the whole surah; ‹ › move between surahs. Current surah + last-read persist via
  `reader-store.ts` (IndexedDB `kv`).
- **Ayah:** `ayah-block.tsx` splits text on whitespace into tappable word `<span>`s
  (`words()`), renders the ayah ornament (`ayahMark`), and an action row:
  play (audio-store), tafsir (tafsir sheet), bookmark (`toggleBookmark`), add to
  memorization (`memorizeAyah`).
- **Font size** comes from settings; the playing ayah is highlighted via the
  audio store.

Offline: fully — text is bundled and cached by the service worker on first load.

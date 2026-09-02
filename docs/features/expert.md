# Expert tools (scholarly depth · study · recite lab · translations)

## Scholarly depth — `src/lib/scholar.ts`
Per-ayah content from the **spa5k tafsir_api** (`{slug}/{s}/{a}.json`), fetched on
demand and cached in IndexedDB (`scholar` store) → offline after first view:
- **إعراب** (`al-i-rab-al-muyassar`) and **غريب** (`asseraj-fi-bayan-gharib-alquran`) —
  the غريب snippet appears in the tap-a-word sheet (fills the Arabic-meaning gap).
- More tafsirs (Ibn Kathīr, Ṭabarī, Saʿdī, Qurṭubī, Baghawī) — chips in the
  **tafsir sheet** (now a scholar panel); `tafsirFor` routes spa5k slugs to `scholarText`.

## Study tools
- **Root concordance** — `src/lib/roots.ts` builds a root→occurrences index from the
  bundled morphology; the word sheet's «كل مواضع الجذر» opens `/root/:root`.
- **Mutashābihāt** — `src/lib/mutashabihat.ts` (≥4-word shingle index over the text);
  the ayah actions «آيات متشابهة» opens `/similar/:s/:a`.
- **Advanced search** — the search screen filters by **juz** and **Meccan/Medinan**.

## Recitation lab — `src/features/recite/` (`/recite-lab`, Home)
Record your recitation per ayah (`MediaRecorder` → `recordings` store), replay,
delete, and **compare** to the reciter. A **mistake tracker** lists surahs with low
Tasmi' accuracy (logged from the live session).

## Translations, export, accessibility
- **Translations** — `translation-manager.tsx`: 10-language catalog downloaded
  whole-book (`downloadTranslation`) → shown under each ayah when active
  (`settings.translation`).
- **Export** — `src/lib/export.ts`: bookmarks/notes/highlights → Markdown download.
- **Accessibility** — a **high-contrast** theme + a **reading-comfort** spacing toggle.

Honest: scholarly text + translations are downloaded on demand then cached (need
internet the first time); recordings stay on-device (not synced).

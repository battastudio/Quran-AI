# Tafsir

`src/features/tafsir/` — ayah explanation, bundled default + downloadable books.

- **Bundled:** `التفسير الميسّر` in `public/data/tafsir-muyassar.json` (one entry
  per ayah) — always offline, the default `tafsir` setting id `muyassar`.
- **Downloadable:** catalog in `public/data/tafsir-catalog.json` (Jalalayn,
  Qurtubi, Waseet, Miqbas). `downloadTafsir()` fetches the whole edition from
  AlQuran Cloud → IndexedDB (`tafsir` store) → offline thereafter.
- **Sheet:** `tafsir-sheet.tsx` reads the active book via `tafsirFor()`; if a
  chosen book isn't downloaded it prompts the user to download it in Settings.
- **Manager:** `download-manager.tsx` (used in Settings → التفسير) — choose active
  book, download/delete editions.

Attribution: all tafsir text comes from King Fahd Complex / AlQuran Cloud
editions; never model-authored.

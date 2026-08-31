# Tajwīd-colored reading

`src/lib/tajweed.ts` (parser, tested) + `src/features/reader/tajweed-text.tsx`.

- Data: `public/data/quran-tajweed.json` (AlQuran Cloud `quran-tajweed` edition,
  fetched by `scripts/fetch-data.mjs`), loaded on demand (not precached).
- `parseTajweed` turns `[<code>[letters]` markup into `{ text, rule? }[]`; `RULES`
  maps rule families (qalqalah, ghunnah, madd, ikhfā', idghām, iqlāb, hamzat
  waṣl, silent, lām shamsiyya) to colors + Arabic names.
- Toggle in **Settings → المصحف → تلوين أحكام التجويد**; a color legend appears
  there. When on, `ayah-block` renders colored segments (a reading mode).

Sacred text is unchanged — only colored. Offline after first load of the tajwīd file.

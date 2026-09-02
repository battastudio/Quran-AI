# Stats · Badges · Islamic toolkit · Hifz tools

## Stats & badges — `src/features/stats/` + `src/lib/{stats,badges}.ts` (tested)
`/stats` (Home card): today/total **reading minutes** (a visibility timer in the
reader → kv), **streak calendar heatmap** (`streakGrid`), **per-juz progress**
(`juzPercent` over the read-pages set, tracked from `markPageRead`), and an
**achievements/badges** grid (`badges()` — streaks, memorized counts, Hafiz of Juz 30,
khatmah, reading hours).

## Islamic toolkit (Home «الأدوات» row)
- **Tasbih** `/tasbih` — misbaha counter, presets, haptics (`lib/haptics`), persisted.
- **99 Names** `/asma` — `public/data/asma.json` (aladhan).
- **Duas** `/duas` — Quranic supplications (`public/data/duas.json`, references only;
  text from the bundled Quran) → tap jumps to the ayah.
- **Hijri calendar** `/calendar` — `lib/hijri.ts` (tested), native `Intl` Umm al-Qura:
  today's date, recommended **fasting days** (Mon/Thu + Ayyām al-Bīḍ), and upcoming
  Islamic **events**.

## Hifz power tools — `src/features/hifz/`
- **Practice** `/hifz/practice` — hide-word / first-letter modes (tap to reveal) +
  **listen-and-repeat** (`audio-store` `repeatLeft`, plays a surah N×).
- **Test-by-juz / weak-ayah** — the hifz review has a filter (all · weak · juz 1–30);
  weak = SM-2 ease < 2.1 (`weakCards()`).

## Polish
PWA **app shortcuts** (manifest: continue · prayer · tasmi · tasbih) and an audio
**sleep timer** in the player sheet.

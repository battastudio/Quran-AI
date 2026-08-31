# Tap-a-word sheet

`src/features/words/` — bottom sheet shown when a word in the reader is tapped.

- `word-store.ts` holds `{ word, surah, ayah, pos }` + open state (`pos` = 1-based
  word index, for pronunciation).
- `word-sheet.tsx` shows the token, a **🔊 pronounce** button (per-word audio from
  `audio.qurancdn.com/wbw/…` via `wordAudioUrl`, cached offline), the ayah
  reference, a tafsir snippet, and a button to the full ayah tafsir.

**Known limitation (ponytail):** per-word Arabic *gloss* / root / i'rab needs the
Quranic Arabic Corpus dataset (Quran.com's word API only ships English
translations). So meaning is conveyed via the ayah tafsir for now; pronunciation
is live. Wiring a غريب/morphology dataset later is the upgrade path — the tap +
audio plumbing is done.

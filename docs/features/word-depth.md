# Word depth — root/grammar + word-synced audio

## Per-word root & grammar
`scripts/fetch-data.mjs` parses the Quranic Corpus (`mustafa0x/quran-morphology`)
→ `public/data/word-morphology.json` (`"s:a:w" → {r root, l lemma, p POS}`).
`lib/quran.ts` `morphologyFor()`; the tap-a-word sheet shows **الجذر / الأصل /
النوع** (POS mapped to Arabic labels) alongside pronounce + tafsir.

*Honest gap:* a plain-Arabic per-word **meaning gloss** still has no free source —
meaning stays via the ayah tafsir; root + grammar + pronunciation are real.

## Word-synced audio highlight (karaoke)
`public/data/segments-alafasy.json` (`"s:a" → [[wordIdx, startMs, endMs]]`, bundled
from Quran.com) drives highlighting. Reader header ▶mic = «استماع مع تظليل» →
`audio-store.playSync` plays **Alafasy** (`verses.quran.com` audio) and, on
`timeupdate`, sets `currentWord`; `ayah-block` highlights it (`.ayah__word--playing`).
Bundled/offline for Alafasy; other reciters would need their own segments (future).

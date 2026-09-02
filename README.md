# نور القرآن — Nour Al Quran

An **offline-first, expert-grade Arabic Quran PWA** — installable on iOS & Android,
works with zero connectivity after first load, deployed to GitHub Pages.

**Live:** https://battastudio.github.io/Quran-AI/

## Features
- **Reader** — verified Uthmani text, 5 views (scroll · mushaf page-swipe · focus ·
  ayah cards · word-by-word), tajwīd colouring, parchment mushaf, RTL, 8 themes +
  high-contrast + reading-comfort.
- **Word depth** — tap a word for **root · grammar · غريب meaning · 🔊 pronunciation**;
  **root concordance** (every occurrence) and **mutashābihāt** (similar ayahs).
- **Tafsir & translation** — Muyassar (bundled) + Ibn Kathīr/Ṭabarī/Saʿdī/… and full
  **إعراب**, all searchable; **10-language translations** (downloadable).
- **Audio** — **176 reciters** (cdn.islamic.network) with preview, bitrate fallback,
  floating player (seek/speed/A–B repeat/sleep timer), per-surah offline download,
  and **word-synced highlighting** (Alafasy).
- **Tasmi'** — live follow-along · memorization test · ayah drill · **offline**
  on-device Whisper (Web Worker), with waveform + accuracy.
- **Memorization** — SM-2 review, hide-word / first-letter practice, listen-and-repeat,
  test-by-juz, weak-ayah tracking; **khatmah** plan; **recitation lab** (record/compare).
- **Worship** — prayer times + Qibla + **adhan sound**, adhkar (counter/haptics),
  tasbīḥ, 99 names, Quranic du‘ā, Hijri calendar (fasting days + events).
- **Personal** — bookmarks + folders, per-ayah notes, colour highlights, Markdown
  export, **stats** (minutes · streak heatmap · per-juz · badges).
- **Platform** — installable PWA, home-screen shortcuts, offline pack, optional
  **Firebase** cross-device live sync (local-first; free).

## Stack
Vite · React · TypeScript · vite-plugin-pwa (Workbox) · IndexedDB (idb) · Zustand ·
framer-motion · adhan-js · @huggingface/transformers (lazy). **No backend** — everything
runs on-device; sacred text is bundled and never model-generated.

## Develop
```sh
npm install
npm run dev            # dev server
npm run build          # tsc + vite → dist/
npm run preview        # serve the build
npm run lint && npm run test
node scripts/fetch-data.mjs   # refresh bundled data (rarely needed)
```

## Docs
- Architecture rules: [CLAUDE.md](CLAUDE.md) · workflow: [AGENTS.md](AGENTS.md)
- Deploy: [docs/DEPLOY.md](docs/DEPLOY.md) · on-device QA: [docs/QA.md](docs/QA.md)
- Firebase sync: [docs/FIREBASE-SETUP.md](docs/FIREBASE-SETUP.md) · stores:
  [docs/STORE.md](docs/STORE.md)
- Per-feature: [docs/features/index.md](docs/features/index.md)

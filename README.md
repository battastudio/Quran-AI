# الفرقان — Al-Furqan AI

An offline-first **Arabic Quran PWA** — installable on mobile, deployable to
GitHub Pages, works with zero connectivity after first load.

**Features:** interactive Uthmani Mushaf with tap-a-word, bundled + downloadable
tafsir, multi-reciter audio with per-surah offline download, on-device prayer
times + Qibla, SM-2 memorization, and an experimental recitation checker (Tasmi').

## Stack
Vite · React · TypeScript · vite-plugin-pwa (Workbox) · IndexedDB (idb) ·
Zustand · adhan-js. No backend — everything runs on-device.

## Develop
```sh
npm install
npm run dev            # dev server
npm run build          # tsc + vite → dist/
npm run preview        # serve the build
npm run lint && npm run test
node scripts/fetch-data.mjs   # refresh bundled Quran/tafsir data (rarely needed)
```

## Deploy
See [docs/DEPLOY.md](docs/DEPLOY.md). Push to `main` → GitHub Actions builds and
publishes to Pages. Enable **Settings → Pages → Source = GitHub Actions** first.

## Docs
Architecture rules: [CLAUDE.md](CLAUDE.md) · workflow: [AGENTS.md](AGENTS.md) ·
per-feature: [docs/features/](docs/features/index.md).

Quran text & tafsir are verified, bundled, and never model-generated.

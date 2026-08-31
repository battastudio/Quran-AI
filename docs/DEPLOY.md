# Deployment — GitHub Pages

The app is a static PWA. `npm run build` outputs `dist/`, which GitHub Pages serves.

## One-time setup
1. Create the repo **`quran_ai`** on GitHub and push this project to `main`.
   - The repo name **must** match `base: '/quran_ai/'` in `vite.config.ts`.
     If you rename the repo, update `base` (and the `href` in `index.html`).
2. GitHub → **Settings → Pages → Build and deployment → Source = GitHub Actions**.
3. Push to `main`. The `.github/workflows/deploy.yml` action builds and deploys.

## URL
`https://<your-username>.github.io/quran_ai/`

## Install on mobile
Open the URL in Safari (iOS) or Chrome (Android) → **Add to Home Screen**.
Launches standalone, works offline after first load.

## Local verify
```sh
npm install
npm run build && npm run preview
# open the printed URL, then DevTools → Network → Offline → reload: still works.
```

## Notes
- Routing uses hash (`/#/...`) so no 404 rewrite is needed on Pages.
- Reciter audio is cached at runtime (not bundled); a surah plays offline only
  after it has been downloaded once.
- Replace the SVG icon with real PNG launcher art before a store-quality release.

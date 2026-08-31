# Deployment — GitHub Pages

The app is a static PWA. `npm run build` outputs `dist/`, which GitHub Pages serves.

## One-time setup
1. Repo is **`battastudio/Quran-AI`**. `base` in `vite.config.ts` must match the
   repo name (case-sensitive): `base: '/Quran-AI/'`. If you rename the repo,
   update `base` and the favicon `href` in `index.html`.
2. GitHub → **Settings → Pages → Build and deployment → Source = GitHub Actions**.
   **This must be done or `deploy` fails with 404** (Pages not enabled).
3. Push to `main`. The `.github/workflows/deploy.yml` action builds and deploys.

## URL
`https://battastudio.github.io/Quran-AI/`

## Install on mobile
Open the URL in Safari (iOS) or Chrome (Android) → **Add to Home Screen**.
Launches standalone, works offline after first load.

## Local verify
```sh
npm install
npm run build && npm run preview
# open the printed URL, then DevTools → Network → Offline → reload: still works.
```

## Optional: cloud login + sync (Firebase)
The app runs fully local-only without this. To enable cross-device sync:
1. Create a Firebase project → add a **Web app**.
2. Enable **Authentication** (Google + Email/Password) and **Cloud Firestore**.
3. Copy `.env.example` → `.env` and fill the `VITE_FIREBASE_*` values.
4. For GitHub Pages, add the same vars as repo **Actions secrets/variables** and
   pass them to the build step (or commit a `.env` — these are client-public keys).
5. Firestore rule so users only touch their own doc:
   `match /users/{uid} { allow read, write: if request.auth.uid == uid; }`

## Notes
- Routing uses hash (`/#/...`) so no 404 rewrite is needed on Pages.
- Reciter audio is cached at runtime (not bundled); a surah plays offline only
  after it has been downloaded once.
- Replace the SVG icon with real PNG launcher art before a store-quality release.

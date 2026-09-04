# Deployment — GitHub Pages

The app is a static PWA. `npm run build` outputs `dist/`, which GitHub Pages serves.

## One-time setup
1. Repo is **`battastudio/Quran-AI`**. `base` in `vite.config.ts` must match the
   repo name (case-sensitive): `base: '/Quran-AI/'`. If you rename the repo,
   update `base` and the favicon `href` in `index.html`.
2. GitHub → **Settings → Pages → Build and deployment → Source = GitHub Actions**.
   **This must be done or `deploy` fails with 404** (Pages not enabled).
3. Push to `main`. The `.github/workflows/deploy.yml` action builds and deploys.

## Pre-push checklist
- [ ] `npx tsc --noEmit && npm run lint && npm run test && npm run build` all green.
- [ ] CI runs `node scripts/gen-og.mjs` before build (regenerates `public/og/*` link-preview
      pages from current data). Run it locally too if you changed Quran data.
- [ ] On `main`, push → watch the **Actions** run go green → hard-refresh the live URL.

## URL
`https://battastudio.github.io/Quran-AI/`

## Install on mobile
- **Android/Chrome:** the app shows an in-app «تثبيت» button (install prompt).
- **iOS/Safari:** the app shows Add-to-Home-Screen instructions (Share ⬆ → «أضف
  إلى الشاشة الرئيسية») — Apple doesn't allow a direct prompt.
- Launches standalone, works offline after first load.

### A real App Store / Play Store binary (optional)
A PWA can't be listed on the stores directly. Wrap this deployed URL with
**PWABuilder** (pwabuilder.com) → generates a signed Android **.aab/APK** (TWA)
and an iOS project. That's the path to store distribution; the PWA itself already
"installs" and runs offline on both platforms via the browser.

## Local verify
```sh
npm install
npm run build && npm run preview
# open the printed URL, then DevTools → Network → Offline → reload: still works.
```

## Optional: cloud login + sync (Firebase — free, no card)
The app runs fully local-only without this. Firebase's **Spark plan is free and
needs no payment/credit card**; Firestore's free quota dwarfs a per-user JSON doc.
To enable cross-device sync:
1. console.firebase.google.com → **Add project** (Spark/free).
2. Add a **Web app** → copy the config (apiKey, projectId, appId, …).
3. **Authentication → Sign-in method:** enable **Google** and **Email/Password**.
4. **Firestore Database → Create** (production mode). Rules tab:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{db}/documents {
       match /users/{uid} { allow read, write: if request.auth.uid == uid; }
     }
   }
   ```
5. Copy `.env.example` → `.env`, fill `VITE_FIREBASE_*`. For GitHub Pages, add the
   same as repo **Actions variables** and pass to the build (client-public keys).
Sync then runs on sign-in, on tab refocus, and every 60s (local-first; only
progress metadata, never audio).

## Notes
- Routing uses hash (`/#/...`) so no 404 rewrite is needed on Pages.
- Reciter audio is cached at runtime (not bundled); a surah plays offline only
  after it has been downloaded once.
- Replace the SVG icon with real PNG launcher art before a store-quality release.

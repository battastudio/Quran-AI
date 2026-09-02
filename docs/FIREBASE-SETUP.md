# Firebase sync — setup (free, ~5 min)

The app works fully **local-only** with no account. To enable cross-device sync
(bookmarks, notes, highlights, memorization, streak, khatmah), add a free Firebase
config. **Spark plan — no payment, no credit card.**

## Steps
1. Go to **console.firebase.google.com → Add project** (accept the free Spark plan).
2. In the project: **Build → Authentication → Get started → Sign-in method** →
   enable **Google** and **Email/Password**.
3. **Build → Firestore Database → Create database** → *production mode* → any region.
4. Firestore **Rules** tab → paste and publish:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{db}/documents {
       match /users/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```
5. **Project settings (⚙) → Your apps → Web app (</>)** → register → copy the config.
6. In the repo, copy `.env.example` → `.env` and fill:
   ```
   VITE_FIREBASE_API_KEY=…
   VITE_FIREBASE_AUTH_DOMAIN=…
   VITE_FIREBASE_PROJECT_ID=…
   VITE_FIREBASE_STORAGE_BUCKET=…
   VITE_FIREBASE_SENDER_ID=…
   VITE_FIREBASE_APP_ID=…
   ```
7. Rebuild/redeploy. For **GitHub Pages**, add the same `VITE_FIREBASE_*` as repo
   **Settings → Secrets and variables → Actions → Variables**, and expose them to the
   build step in `.github/workflows/deploy.yml` (`env:` under the `npm run build` step).
   (These are client-public keys; safe to expose. Security is enforced by the
   Firestore rule above.)

## What you get
- **Settings → الحساب والمزامنة** shows sign-in (Google / email).
- Sync runs on sign-in, on tab refocus, every 60s, **and live** (`onSnapshot`) —
  changes on one device appear on the other in real time. Audio/voice are never synced.

## Free-tier limits (plenty for personal use)
Auth: free. Firestore: 1 GiB storage, ~50K reads / 20K writes per day. A user's
profile is a single small JSON doc.

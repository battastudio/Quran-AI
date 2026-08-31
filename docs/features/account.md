# Account & sync (optional, Firebase)

`src/features/auth/` + `src/lib/{firebase,sync,merge}.ts`.

**Local-first.** IndexedDB is always the source of truth. Cloud sync is optional
and only turns on when Firebase env config is present (`.env`, see `.env.example`).
Without it, `cloudEnabled = false`, the account UI hides, and nothing else changes.

- `firebase.ts` — **lazy** (dynamic import) init from `VITE_FIREBASE_*`. Local-only
  users never download the Firebase SDK; it's a separate chunk fetched on sign-in.
- `auth-store.ts` — Google popup / email+password sign-in, sign-out; `onAuthStateChanged`.
- `sync.ts` — `syncNow(uid)`: pull `users/{uid}` doc → `mergeProfiles` with local
  (`exportData` + streak + khatmah) → write both. Runs on sign-in and "sync now".
- `merge.ts` — pure `mergeProfiles` (tested): bookmarks/hifz **union** (no data
  loss), streak union, scalar prefs last-write-wins by `updatedAt`.

Synced data is progress metadata only — **never audio/voice**. Setup: create a
Firebase project, enable Auth (Google + Email/Password) + Firestore, paste the web
config into `.env`. See `docs/DEPLOY.md`.

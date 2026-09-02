# Extras (adhkar · share · media session · install · onboarding)

**Adhkar** — `src/features/adhkar/` (`/adhkar`, Home card). 132 categories from
Hisn al-Muslim (`public/data/adhkar.json`, attributed; not Quran text) + quick
tabs (الصباح والمساء · بعد الصلاة · النوم · الاستيقاظ). `dhikr-counter.tsx`:
tap-anywhere counter with a **progress ring**, **haptic** + tap **sound**
(`src/lib/haptics.ts`), and **auto-advance** to the next dhikr on reaching the
target. Targets are inferred from the text (`src/lib/adhkar.ts` `targetCount`,
tested) and adjustable. Offline (bundled).

**Share ayah as image** — `src/lib/share-image.ts`. Canvas-renders the ayah +
reference + «نور القرآن» → PNG; uses `navigator.share({ files })` when available,
else downloads. Triggered by the ↗ action on an ayah.

**Lock-screen audio** — `src/store/audio-store.ts` sets `navigator.mediaSession`
metadata + play/pause/next/prev handlers, so OS/lock-screen controls drive playback.

**Install & offline UX** — `src/features/install/`.
- `install-prompt.tsx`: Android/Chrome native install button (`beforeinstallprompt`);
  iOS Safari shows Add-to-Home-Screen instructions. Dismiss persists.
- `update-toast.tsx`: `useRegisterSW` → «جاهز للعمل دون إنترنت» + «تحديث متوفّر».
- iOS installs via Safari only; for a real store binary, wrap with PWABuilder
  (see `docs/DEPLOY.md`).

**Onboarding** — `src/features/onboarding/`. One-time first-run overlay: pick
reciter, offer location + notification permissions. `onboarded` flag in IndexedDB.

# CLAUDE.md — al_furqan_ai

An **offline-first Arabic Quran PWA** (Progressive Web App), built with
**Vite + React + TypeScript**, deployed to **GitHub Pages**. These rules
OVERRIDE defaults — follow them exactly.

## Non-negotiables (read before writing anything)
- **Static PWA, no backend.** GitHub Pages serves only static files. Nothing may
  assume a server, an API you control, or runtime secrets. All data is either
  bundled JSON (`src/data/`) or cached on-device (IndexedDB / service worker).
- **The app must work fully in airplane mode after first load.** Every feature
  degrades gracefully offline. A network path with no offline fallback is a bug.
- **Quranic text is sacred and immutable.** Verse text, diacritics, and verse
  boundaries come ONLY from the verified bundled source in `src/data/quran/`.
  NEVER generate, edit, translate, or interpolate Quranic text. Word meanings,
  tafsir, and asbāb al-nuzūl are **attributed data files** — never model-authored.
- **Arabic-only, RTL-first.** No translation locale. `<html dir="rtl" lang="ar">`.
  Use logical CSS (`margin-inline`, `padding-inline`, `inset-inline`) — never
  physical left/right. Ayah text uses the bundled Uthmani/Quran font; UI chrome
  uses the UI font.
- **Privacy.** No analytics that ship audio or PII. When ASR lands, the mic is
  on-device only, explicit consent, never uploaded.

## Architecture — feature folders
One folder per feature under `src/features/<name>/`, each with its component(s),
hooks, and an `index.ts` barrel. When you add a file, **add it to its barrel**.

```
src/
  app/            router, providers, PWA registration, root shell
  features/
    reader/        Mushaf view, page/surah nav, word-by-word highlight
    audio/         reciter player + per-surah download manager
    tafsir/        tafsir reader + download manager
    words/         word meaning / root / i'rab / asbab bottom sheet
    prayer/        prayer times + qibla (adhan-js)
    hifz/          memorization + SM-2 spaced repetition + dashboard
    notifications/ reminder scheduler
    settings/      advanced control panel (the hub — see below)
  data/            bundled immutable JSON (quran text, words, surah meta)
  lib/             db (idb wrapper), audio-cache, sw helpers, hijri, format
  store/           zustand stores (one per domain)
  components/       shared UI (bottom-sheet, button, list, skeleton, toggle…)
  styles/          theme tokens (light/dark), rtl, fonts
```

## Reuse first
- Before writing UI, check `src/components/` — reuse or extend; only add a new
  component when nothing fits.
- Route ALL device/browser access (geolocation, notifications, storage, mic,
  audio, sensors) through a wrapper in `src/lib/` — never call a browser API
  directly from a component.

## Data & offline
- All reads go through `src/lib/db.ts` (IndexedDB) with a bundled-JSON fallback.
- Every network fetch (audio, tafsir download) is **cache-first** and shows a
  visible state (loading skeleton / downloaded / failed-retry) — never a blank
  gap or a bare spinner for content.
- **Do NOT bundle audio** (Pages size limits) — stream from the CDN and cache
  per-surah on explicit download.
- Separate immutable sacred data (`src/data/`) from user/derived data (IndexedDB:
  progress, hifz schedule, downloads, settings).

## Settings is the hub
Any new downloadable or toggleable capability — a tafsir book, a reciter, a
reminder, a theme, a font size — MUST expose its control on the **Settings page**
(`src/features/settings/`) and persist to IndexedDB. Sections: Audio, Tafsir,
Reader, Notifications, Memorization, Data/Storage.

## State
- **Zustand**, one store per domain in `src/store/`. No Redux, no boilerplate.
- No logic in render; side effects go in event handlers or `useEffect`, not as a
  side effect of rendering.

## Style & limits
- TypeScript **strict**. No `any` without a written reason. Parse external/bundled
  JSON defensively; never force-non-null (`!`) unguarded API/JSON data.
- **~150-line soft cap per file** — split into components/hooks before it grows.
- `kebab-case` files/folders, `PascalCase` components/types, `camelCase` ids.
- No hardcoded colors/sizes — use theme tokens in `src/styles/`. No inline hex.
- Accessibility: labels on icon-only buttons, tap targets ≥44px, respects text
  scaling and dark mode, correct RTL.

## Definition of done (per feature)
- Feature folder + `index.ts` barrel wired into the router (and Settings if it
  exposes options).
- `tsc --noEmit`, `npm run lint`, `npm run build` all clean; `npm run test` green.
- Works offline (verified with DevTools offline toggle after a build).
- A **doc per feature** under `docs/features/`.
- Verified visually in Arabic RTL in **both light and dark**.
- If a required asset (font/icon/data file) is missing: **STOP and ask** — no
  placeholders, and never a placeholder for sacred content.

## Never
- Assume a backend, add a runtime secret, or bundle audio.
- Alter, generate, or "fix" Quranic text or diacritics.
- Add an npm dependency without asking (keep the stack minimal).
- Hardcode strings/colors/sizes, swallow errors, or leave a network path with no
  offline fallback.
- Exceed the file-size cap or skip a feature's doc.
- Add a `Co-Authored-By` line or any AI attribution to a commit (overrides the
  default assistant trailer) — commits are under the user's identity only.

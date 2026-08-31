# Settings (the hub)

`src/features/settings/` — every downloadable/toggleable capability lives here.
State is in `src/store/settings-store.ts`, persisted to IndexedDB and hydrated on
boot; theme is applied via `data-theme` on `<html>`.

Sections (`settings-screen.tsx`, native collapsible `<details>`):
1. **التلاوة والصوت** → `AudioSettings` (reciter + per-surah downloads).
2. **التفسير** → `TafsirManager` (active book + downloads).
3. **المصحف** → `reader-settings.tsx` (theme auto/light/dark, ayah font size,
   word-hint toggle).
4. **التنبيهات** → `notify-settings.tsx` (reminder toggles + calc method +
   notification permission).
5. **البيانات والتخزين** → `data-settings.tsx` (export/import progress JSON,
   reset app + clear caches).

Adding any new capability? Surface its control here and persist it (CLAUDE.md rule).

# AGENTS.md — al_furqan_ai

Read **CLAUDE.md** first — it defines the architecture and non-negotiables. This
file is the workflow.

## Per-task loop
1. Restate the task and the exact files it will touch.
2. Read the feature folder + its `index.ts` barrel before editing.
3. Make the change by hand (no scaffold generators). Keep each file ≤150 lines.
4. Wire new files into their barrel, the router, and — if it adds a
   downloadable/toggleable capability — the **Settings** page.
5. Run the allowed commands below until clean, then write/update the feature doc.

## Definition of done
- [ ] `tsc --noEmit` reports no errors.
- [ ] `npm run lint` is clean.
- [ ] `npm run build` succeeds.
- [ ] `npm run test` passes.
- [ ] App still works **offline** after a build (DevTools → offline → reload).
- [ ] New capability (if any) is surfaced on the Settings page and persisted.
- [ ] Every touched file exports through its `index.ts` barrel; each is ≤150 lines.
- [ ] All data reads go through `src/lib/db.ts` with a bundled fallback; no
      network path lacks an offline/degraded state.
- [ ] Quranic text was NOT altered; new meanings/tafsir come from attributed data.
- [ ] Feature has a doc under `docs/features/`.
- [ ] Screen visually matches intent in Arabic RTL, light & dark.
- [ ] Missing assets were requested, not guessed.

## Allowed commands
```sh
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run test
npx tsc --noEmit
```

## Never
- Add an npm dependency without asking (keep the stack minimal).
- Assume a backend / runtime secret, or bundle audio into the app.
- Alter or generate Quranic text or diacritics.
- Hardcode strings/colors/sizes, swallow errors, or leave a network path with no
  offline fallback.
- Exceed 150 lines in a file, or skip a feature's doc.
- Add a `Co-Authored-By` line or any AI attribution to a commit.

# Design system + growth (Fable spec)

## Design system
- `src/styles/tokens.css` — authoritative role tokens (§D.8): `--surface-0..3`, `--paper`,
  `--ink-quran/1/2/3`, `--accent`, `--gold`, tajwīd, highlights, scholars, type scale,
  spacing, radius, elevation, motion; 8 themes (`[data-theme]`), `[data-contrast=high]`,
  reduced-motion. Imported first in `main.tsx`.
- `src/styles/theme.css` — now **aliases** legacy tokens (`--bg`→`--surface-0`, …) to the
  roles so existing components keep working. `src/styles/nour.css` — component skins.
- `src/motion/variants.ts` — shared framer-motion variants (§D.6).
- Type utilities: `.t-ayah-*`, `.t-3xl…t-xs`.

## Primitives
- `components/bottom-sheet.tsx` — drag-to-dismiss, focus trap + return, Esc/back close.
- `app/bottom-bar.tsx` + `nour.css` — §D.7 bar + centre-mic FAB (haptics, listening ring,
  reselect-to-top, desktop rail).

## Deep links (`app/deep-links.tsx`, routes in `app/app.tsx`)
- `#/s/:s/:a` → open reader at that ayah (shared links).
- `#/today` → today's wird ayah (`lib/wird.ts` `todayAyah`).
- `#/khatmah/join?g=…` → group-khatmah juz picker (`features/khatmah/join-screen.tsx`).
- **OG prerender:** `scripts/gen-og.mjs` → `public/og/{s}-{a}.html` (114 openers + famous
  ayahs) with OG tags for rich link previews. Run after data changes. Excluded from SW
  precache (`vite.config.ts` globIgnores `og/**`).

## Share (da'wah)
- `lib/share-image.ts` — ayah cards in 6 templates (`CARD_TEMPLATES`) × square/story, with a
  deep-link + «مجاناً بلا إعلانات» footer; ijāza/report certificates. All on-device canvas.
- `features/share/invite.ts` + `invite-sheet.tsx` — one-time invite after the first
  completed wird (triggered from `khatmah-store.markTodayDone`); also `شارك التطبيق` +
  `حول التطبيق` (sources/licences) in Settings.
- `features/khatmah/group.ts` + `group-invite.tsx` — shareable group-khatmah link, no backend.

## Reverence
- `src/lib/quran-integrity.test.ts` — 114 surahs / 6236 ayahs / byte-faithful text.
- Tasmi honesty copy; `lib/badges.ts` reverent quality names + geometric motifs; streak =
  «الاستمرار». Tasmi accuracy labels never shame (`accuracyLabel`).

## Deferred (need a dep or backend — ask first)
Mosque **QR** poster (needs a QR encoder lib), `[BACKEND]` live group khatmah / halaqa /
opt-in analytics, TWA Play listing, tajwīd grading, multi-reciter word-sync.

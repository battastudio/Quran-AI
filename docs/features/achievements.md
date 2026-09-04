# Achievements, Certificates & Mastery Path

Da'wah-friendly milestones. All rendering is **on-device** (canvas) — offline, no
backend, no upload.

## Screens
- **`/achievements`** (`features/achievements/achievements-screen.tsx`) — a **progress
  report** card (memorized ayahs · streak · khatmah % · reading minutes) with
  "مشاركة التقرير", plus **ijāza certificates** per surah (enabled once a surah is fully
  memorized). Tapping a surah opens its mastery path.
- **`/mastery/:surah`** (`mastery-screen.tsx`) — vertical **mastery path**: the surah
  split into 10-ayah stages, each showing memorized progress (done / now / todo) from the
  hifz cards; tap a stage → `/hifz/practice`.

## Shareable images (`lib/share-image.ts`)
- `renderAyahCard` / `shareAyahImage(text, ref, { tafsir?, format })` — ayah cards in
  **square** or **story (9:16)** format; wired as "صورة" and "بطاقة قصة" in the ayah
  actions sheet.
- `renderCertificate` / `shareCertificate(title, name, body)` — portrait ijāza / report
  certificate with the ornate gold Nour frame.

All use the Nour palette (parchment `#FDF2E7`, green `#004333`, gold `#785A00`), Amiri
Quran for sacred text (drawn as-is, never edited), IBM Plex Sans Arabic for UI.

## Similarity tree
`features/reader/occurrences-screen.tsx` renders `/similar/:s/:a` as a **tree**: the
anchor ayah as a green root node + connected branches to each mutashābih match (reuses
`lib/mutashabihat.ts`). `/root/:root` keeps the flat concordance list.

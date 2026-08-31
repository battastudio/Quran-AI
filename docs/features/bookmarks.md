# Bookmarks & notes

`src/features/bookmarks/` + IndexedDB `notes` store (`src/lib/db.ts`, DB v2).

- Bookmark any ayah with ★; add a personal note with 📝 (`note-sheet.tsx`,
  mounted globally). Notes keyed by `surah:ayah`.
- `bookmarks-screen.tsx` (`/bookmarks`, Home card): all saved ayahs + their notes,
  jump-to (`reader.goTo`), edit note, remove.
- Syncs via the profile: `Profile.notes` + `mergeProfiles` union (latest-edited
  wins per ayah); included in export/import and reset.

Offline: fully.

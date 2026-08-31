# Audio (multi-reciter)

`src/features/audio/` + `src/store/audio-store.ts` + `src/lib/audio-*.ts`.

- **Source:** everyayah.com CDN. URL built by `ayahAudioUrl(reciter, surah, ayah)`.
  Reciter catalog in `public/data/reciters.json` (6 reciters).
- **Playback:** `audio-store.ts` owns one `<audio>` element and a queue; plays a
  single ayah or a whole surah with auto-advance (drives reader highlight),
  speed (0.75–1.5×) and A–B loop.
- **Mini-player:** `mini-player.tsx` — global bar above the tabs, shown while a
  track is loaded (play/pause, loop, speed, stop).
- **Offline downloads:** `audio-settings.tsx` (Settings → الصوت) downloads a surah
  by prefetching every ayah mp3 so the service worker caches it
  (`downloadSurah`); `deleteSurah` clears it. Downloaded surahs per reciter are
  tracked in IndexedDB.

Not bundled (GitHub Pages size) — audio streams on first play, plays offline
only after a surah is downloaded.

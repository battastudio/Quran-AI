# Audio (multi-reciter)

`src/features/audio/` + `src/store/audio-store.ts` + `src/lib/audio-*.ts`.

- **Source:** `cdn.islamic.network` — **176 Arabic reciters**. URL built by
  `ayahAudioUrl(edition, globalAyah, bitrate)` (needs the global ayah number `g`
  bundled in `quran.json`). Reciter catalog (`ar.*` editions) in
  `public/data/reciters.json`; **searchable** picker + bitrate (64/128/192) in
  Settings → التلاوة والصوت.
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

## Playback reliability
islamic.network hosts **different bitrates per reciter** (e.g. Sudais 64 not 128).
`audio-store.ts` tries `[128, 64, 192]` on `<audio>` error and caches the working
one per reciter (`bitrateCache` in IndexedDB); a friendly message shows if all
fail. `settings-store` **migrates** stale pre-CDN reciter ids (`Alafasy_128kbps` →
`ar.alafasy`). Popular reciters (Afasy, Sudais, Abdul Basit, Minshawi, Husary) are
pinned atop the searchable picker. Tap the mini-player → **floating full player**
(`player-sheet.tsx`): seek, reciter switcher, speed, A–B loop, next/prev.

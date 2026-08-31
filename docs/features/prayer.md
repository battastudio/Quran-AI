# Prayer times & Qibla

`src/features/prayer/` — computed on-device, no network.

- **Times:** `prayer-times.ts` uses `adhan` from `src/lib/geo.ts` coordinates.
  Calculation method is a setting (Umm al-Qura default; MWL, Egyptian, Karachi,
  ISNA, Dubai). Last GPS fix is cached in IndexedDB so times work offline.
- **Screen:** `prayer-screen.tsx` — list of the five prayers + sunrise, next
  prayer highlighted with a live countdown.
- **Qibla:** `qibla-compass.tsx` — bearing from `adhan.Qibla`; rotates with the
  device heading via `deviceorientation` (`webkitCompassHeading` on iOS). Falls
  back to a fixed bearing if no compass sensor.

Offline: fully after the first location fix.

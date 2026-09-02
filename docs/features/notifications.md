# Notifications & reminders

`src/features/notifications/scheduler.ts` — best-effort reminders.

Fired via `runReminders()` on app open (deduped once-per-day in IndexedDB):
- **Prayer:** while the tab is open, the next prayer within the hour is scheduled
  with `setTimeout`.
- **Kahf:** Friday reminder to read Sūrat al-Kahf.
- **Fasting:** Monday/Thursday reminder (white days need the Hijri calendar —
  not yet wired).
- **Hifz:** reminder when review cards are due.
- Each toggle lives in Settings → التنبيهات; calc method is shared with Prayer.

## Background (best-effort)
`scheduler.ts` registers **Periodic Background Sync** (`periodicSync.register
('reminders', …)`) and keeps a `reminderNudge` (next prayer / adhkar) in IndexedDB.
`public/sw-reminders.js` (injected via `workbox.importScripts`) has `periodicsync`
+ `notificationclick` handlers that read the nudge and `showNotification`.

## Honest limitation
Periodic sync fires **only on installed Android/Chrome**, at coarse intervals
(≥12h), never guaranteed. **iOS/Safari and Firefox don't support it** → those stay
**foreground-only**. Truly reliable background athan needs Web Push + a server, or a
native (Capacitor) wrapper — out of scope for this static PWA build.

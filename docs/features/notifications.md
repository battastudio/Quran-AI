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

## Honest limitation
PWAs — especially iOS Safari — **cannot reliably schedule background
notifications**. There is no server (static GitHub Pages) to push them. So
reminders are best-effort and fire mainly when the app is open. A future native
wrapper or Web Push (needs a server) would make them reliable. Do not promise
guaranteed background athan on iOS.

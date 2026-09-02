import { getKv, setKv } from '../../lib/db';
import { savedCoords } from '../../lib/geo';
import { dueCards } from '../hifz';
import { computeTimes } from '../prayer/prayer-times';
import { useSettings } from '../../store/settings-store';

// Honest limits: PWAs (esp. iOS) can't reliably schedule background notifications.
// We fire best-effort reminders when the app is open + schedule the next prayer
// via setTimeout while the tab lives. Documented in docs/features/notifications.md.

export async function requestNotifyPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  return (await Notification.requestPermission()) === 'granted';
}

function notify(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted')
    new Notification(title, { body });
}

const today = () => new Date().toDateString();
async function oncePerDay(tag: string): Promise<boolean> {
  if ((await getKv<string>(`notified:${tag}`)) === today()) return false;
  await setKv(`notified:${tag}`, today());
  return true;
}

// Call on app open. Fires the reminders that are enabled and due.
export async function runReminders(): Promise<void> {
  const { notify: on } = useSettings.getState();
  const day = new Date().getDay(); // 0=Sun … 5=Fri, 6=Sat

  if (on.hifz && (await oncePerDay('hifz'))) {
    const due = await dueCards();
    if (due.length) notify('مراجعة الحفظ', `لديك ${due.length} آية للمراجعة اليوم.`);
  }
  if (on.kahf && day === 5 && (await oncePerDay('kahf')))
    notify('يوم الجمعة', 'لا تنسَ قراءة سورة الكهف.');
  if (on.fasting && (day === 1 || day === 4) && (await oncePerDay('fast')))
    notify('صيام السنة', day === 1 ? 'اليوم الاثنين — صيام مستحب.' : 'اليوم الخميس — صيام مستحب.');

  if (on.prayer) await scheduleNextPrayer();

  await updateNudge(on);
  void registerPeriodicSync();
}

// A single "nudge" the service worker can show on periodic background sync
// (best-effort; installed Android/Chrome only — iOS is foreground-only).
async function updateNudge(on: ReturnType<typeof useSettings.getState>['notify']): Promise<void> {
  let title = '', body = '';
  const coords = await savedCoords();
  if (on.prayer && coords) {
    const { rows } = computeTimes(coords, useSettings.getState().calcMethod);
    const next = rows.find((r) => r.key !== 'sunrise' && r.time.getTime() > Date.now());
    if (next) { title = 'نور القرآن'; body = `الصلاة القادمة: ${next.name}`; }
  }
  if (!title && on.adhkar) { title = 'نور القرآن'; body = 'لا تنسَ أذكارك اليوم 🌿'; }
  if (title) await setKv('reminderNudge', { title, body });
}

async function registerPeriodicSync(): Promise<void> {
  try {
    const reg = await navigator.serviceWorker?.ready;
    const ps = (reg as unknown as { periodicSync?: { register: (t: string, o: object) => Promise<void> } })?.periodicSync;
    if (!ps) return;
    const status = await navigator.permissions.query({ name: 'periodic-background-sync' as PermissionName }).catch(() => null);
    if (status && status.state !== 'granted') return;
    await ps.register('reminders', { minInterval: 12 * 60 * 60 * 1000 });
  } catch {
    /* unsupported (iOS/Safari/Firefox) — foreground reminders still work */
  }
}

async function scheduleNextPrayer(): Promise<void> {
  const coords = await savedCoords();
  if (!coords) return;
  const { rows } = computeTimes(coords, useSettings.getState().calcMethod);
  const now = Date.now();
  const next = rows.find((r) => r.key !== 'sunrise' && r.time.getTime() > now);
  if (!next) return;
  const ms = next.time.getTime() - now;
  if (ms < 3_600_000)
    setTimeout(() => {
      notify('حان وقت الصلاة', `حان الآن وقت ${next.name}`);
      if (useSettings.getState().adhanSound) new Audio(`${import.meta.env.BASE_URL}adhan.mp3`).play().catch(() => {});
    }, ms);
}

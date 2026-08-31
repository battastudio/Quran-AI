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
}

async function scheduleNextPrayer(): Promise<void> {
  const coords = await savedCoords();
  if (!coords) return;
  const { rows } = computeTimes(coords, useSettings.getState().calcMethod);
  const now = Date.now();
  const next = rows.find((r) => r.key !== 'sunrise' && r.time.getTime() > now);
  if (!next) return;
  const ms = next.time.getTime() - now;
  if (ms < 3_600_000) setTimeout(() => notify('حان وقت الصلاة', `حان الآن وقت ${next.name}`), ms);
}

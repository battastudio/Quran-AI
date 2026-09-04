import { useEffect, useState } from 'react';
import { AppHeader, Spinner } from '../../components';
import { arabicNum } from '../../lib/format';
import { currentCoords, savedCoords, type Coords } from '../../lib/geo';
import { useSettings } from '../../store/settings-store';
import { computeTimes, type PrayerRow } from './prayer-times';
import { QiblaCompass } from './qibla-compass';

const fmt = (d: Date) => arabicNum(d.getHours() % 12 || 12) + ':' + arabicNum(String(d.getMinutes()).padStart(2, '0'));

export function PrayerScreen() {
  const method = useSettings((s) => s.calcMethod);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    void savedCoords().then((c) => c && setCoords(c));
    currentCoords().then(setCoords).catch(() => setErr('لم نتمكّن من تحديد موقعك. فعّل إذن الموقع.'));
  }, []);

  if (!coords)
    return (
      <section className="screen">
        <AppHeader section="الصلاة" />
        {err ? <p className="error">{err}</p> : <Spinner label="جارٍ تحديد الموقع…" />}
      </section>
    );

  const { rows, qibla } = computeTimes(coords, method);
  const now = Date.now();
  const upcoming = rows.find((r) => r.key !== 'sunrise' && r.time.getTime() > now) ?? rows[0];

  return (
    <section className="screen">
      <AppHeader section="مواقيت الصلاة والقبلة" />
      <NextCountdown row={upcoming} />
      <ul className="prayer-list">
        {rows.map((r) => (
          <li key={r.key} className={r.key === upcoming.key ? 'prayer-row prayer-row--next' : 'prayer-row'}>
            <span>{r.name}</span>
            <span>{fmt(r.time)}</span>
          </li>
        ))}
      </ul>
      <QiblaCompass qibla={qibla} />
    </section>
  );
}

function NextCountdown({ row }: { row: PrayerRow }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);
  let ms = row.time.getTime() - Date.now();
  if (ms < 0) ms += 86_400_000;
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return (
    <div className="prayer-hero">
      <span className="prayer-hero__k">الصلاة القادمة</span>
      <b className="prayer-hero__name">{row.name}</b>
      <span className="prayer-hero__time">{fmt(row.time)}</span>
      <span className="prayer-hero__count">بعد {arabicNum(h)} س {arabicNum(m)} د</span>
    </div>
  );
}

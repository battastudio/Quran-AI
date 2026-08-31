import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { allAyahsFlat, surahList } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import { getKv } from '../../lib/db';
import { computeStreak } from '../../lib/streak';
import { savedCoords } from '../../lib/geo';
import { useReader } from '../../store/reader-store';
import { useSettings } from '../../store/settings-store';
import { useKhatmah } from '../khatmah';
import { dueCards } from '../hifz';
import { computeTimes } from '../prayer';
import { VerseOfDay } from './verse-of-day';

export function HomeScreen() {
  const nav = useNavigate();
  const goTo = useReader((s) => s.goTo);
  const lastRead = useReader((s) => s.lastRead);
  const method = useSettings((s) => s.calcMethod);
  const plan = useKhatmah((s) => s.plan);
  const hydrateK = useKhatmah((s) => s.hydrate);
  const [streak, setStreak] = useState(0);
  const [due, setDue] = useState(0);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const [names, setNames] = useState<Record<number, string>>({});

  useEffect(() => {
    void hydrateK();
    void getKv<string[]>('streakDays').then((d) => setStreak(computeStreak(d ?? [])));
    void dueCards().then((c) => setDue(c.length));
    void surahList().then((l) => setNames(Object.fromEntries(l.map((s) => [s.n, s.name]))));
    void savedCoords().then((c) => {
      if (!c) return;
      const { rows } = computeTimes(c, method);
      const up = rows.find((r) => r.key !== 'sunrise' && r.time.getTime() > Date.now());
      if (up) setNextPrayer(`${up.name} ${arabicNum(up.time.getHours() % 12 || 12)}:${arabicNum(String(up.time.getMinutes()).padStart(2, '0'))}`);
    });
  }, [method, hydrateK]);

  return (
    <section className="screen">
      <h1 className="screen__title">السلام عليكم</h1>
      <div className="home-grid">
        {lastRead && (
          <button className="home-card" onClick={() => { goTo(lastRead.surah, lastRead.ayah); nav('/mushaf'); }}>
            <span className="home-card__k">متابعة القراءة</span>
            <b>{names[lastRead.surah] ?? `سورة ${arabicNum(lastRead.surah)}`}</b>
          </button>
        )}
        <button className="home-card" onClick={() => nav('/hifz')}>
          <span className="home-card__k">مراجعة الحفظ</span>
          <b>{arabicNum(due)} آية اليوم</b>
        </button>
        <div className="home-card">
          <span className="home-card__k">التتابع 🔥</span>
          <b>{arabicNum(streak)} يوم</b>
        </div>
        {nextPrayer && (
          <button className="home-card" onClick={() => nav('/prayer')}>
            <span className="home-card__k">الصلاة القادمة</span>
            <b>{nextPrayer}</b>
          </button>
        )}
        <button className="home-card" onClick={() => nav('/khatmah')}>
          <span className="home-card__k">الختمة</span>
          <b>{plan ? `${arabicNum(plan.days)} يوم` : 'ابدأ ختمة'}</b>
        </button>
        <button className="home-card" onClick={() => nav('/tasmi')}>
          <span className="home-card__k">التسميع</span>
          <b>تدرّب الآن</b>
        </button>
        <button className="home-card" onClick={() => nav('/search')}>
          <span className="home-card__k">البحث</span>
          <b>ابحث في القرآن</b>
        </button>
      </div>
      <VerseOfDay
        onOpen={(s, a) => { goTo(s, a); nav('/mushaf'); }}
        name={(n) => names[n] ?? `سورة ${arabicNum(n)}`}
        load={allAyahsFlat}
      />
    </section>
  );
}

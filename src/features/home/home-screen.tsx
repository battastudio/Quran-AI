import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { allAyahsFlat, surahList } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import { getKv } from '../../lib/db';
import { computeStreak } from '../../lib/streak';
import { savedCoords } from '../../lib/geo';
import { AppHeader, Icon } from '../../components';
import { useReader } from '../../store/reader-store';
import { useSettings } from '../../store/settings-store';
import { useAuth } from '../auth';
import { useKhatmah } from '../khatmah';
import { InstallButton } from '../install';
import { dueCards } from '../hifz';
import { computeTimes } from '../prayer';
import { selectTodayWird, type TodayWird } from '../../lib/wird';
import { VerseOfDay } from './verse-of-day';
import { GreetingCard } from './greeting-card';
import { ContinueCard } from './continue-card';
import { ReviewWird } from './review-wird';
import { FridayBanner } from './friday-banner';
import { QuickTools } from './quick-tools';

const MORE = [
  { to: '/search', label: 'البحث', icon: 'search' },
  { to: '/stats', label: 'إحصاءاتي', icon: 'grid' },
  { to: '/bookmarks', label: 'المحفوظات', icon: 'bookmark' },
  { to: '/asma', label: 'الأسماء', icon: 'star' },
  { to: '/calendar', label: 'التقويم', icon: 'clock' },
  { to: '/recite-lab', label: 'معمل التلاوة', icon: 'mic' },
  { to: '/achievements', label: 'الشهادات', icon: 'check' },
];

export function HomeScreen() {
  const nav = useNavigate();
  const goTo = useReader((s) => s.goTo);
  const lastRead = useReader((s) => s.lastRead);
  const method = useSettings((s) => s.calcMethod);
  const userName = useAuth((s) => s.user?.displayName ?? null);
  const plan = useKhatmah((s) => s.plan);
  const hydrateK = useKhatmah((s) => s.hydrate);
  const [streak, setStreak] = useState(0);
  const [due, setDue] = useState(0);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const [names, setNames] = useState<Record<number, string>>({});
  const [cont, setCont] = useState<{ text: string; juz: number } | null>(null);
  const [wird, setWird] = useState<TodayWird | null>(null);

  useEffect(() => {
    void hydrateK();
    void selectTodayWird().then(setWird);
    void getKv<string[]>('streakDays').then((d) => setStreak(computeStreak(d ?? [])));
    void dueCards().then((c) => setDue(c.length));
    void surahList().then((l) => setNames(Object.fromEntries(l.map((s) => [s.n, s.name]))));
    void savedCoords().then((c) => {
      if (!c) return;
      const { rows } = computeTimes(c, method);
      const up = rows.find((r) => r.key !== 'sunrise' && r.time.getTime() > Date.now());
      if (up) setNextPrayer(`صلاة ${up.name} ${arabicNum(up.time.getHours() % 12 || 12)}:${arabicNum(String(up.time.getMinutes()).padStart(2, '0'))}`);
    });
  }, [method, hydrateK]);

  useEffect(() => {
    if (!lastRead) { setCont(null); return; }
    void allAyahsFlat().then((all) => {
      const y = all.find((v) => v.s === lastRead.surah && v.a === lastRead.ayah);
      if (y) setCont({ text: y.t, juz: y.j });
    });
  }, [lastRead]);

  const name = (n: number) => names[n] ?? `سورة ${arabicNum(n)}`;
  const wirdPct = plan ? Math.min(100, Math.round((plan.donePages / 604) * 100)) : null;
  const openReader = (s: number, a: number) => { goTo(s, a); nav('/mushaf'); };

  return (
    <section className="screen home">
      <AppHeader section="الرئيسية" />
      <GreetingCard name={userName} nextPrayer={nextPrayer} />
      <InstallButton block />
      {lastRead && cont && (
        <ContinueCard
          surahName={name(lastRead.surah)}
          ayah={lastRead.ayah}
          juz={cont.juz}
          text={cont.text}
          onOpen={() => openReader(lastRead.surah, lastRead.ayah)}
        />
      )}
      <ReviewWird due={due} wirdPct={wirdPct} wird={wird} onReview={() => nav('/hifz')} onWird={() => nav('/khatmah')} />
      <FridayBanner onKahf={() => openReader(18, 1)} />
      <QuickTools />
      <VerseOfDay onOpen={openReader} name={name} load={allAyahsFlat} />
      <div>
        <div className="sec-head"><span className="sec-head__title">أدوات أخرى</span></div>
        <div className="tools-row">
          {MORE.map((m) => (
            <button key={m.to} onClick={() => nav(m.to)}>
              <span aria-hidden="true"><Icon name={m.icon} size={20} /></span>
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <p className="home-foot">
        <b>مصحف المدينة النبوية</b> — رواية حفص عن عاصم<br />
        جاهز للعمل بدون إنترنت · الاستمرار {arabicNum(streak)} يوم
      </p>
    </section>
  );
}

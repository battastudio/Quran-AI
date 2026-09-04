import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader, Icon } from '../../components';
import { arabicNum } from '../../lib/format';
import { getKv } from '../../lib/db';
import { surahList } from '../../lib/quran';
import { computeStreak } from '../../lib/streak';
import { progressPct, type KhatmahPlan } from '../../lib/khatmah';
import { readMinutes } from '../../lib/stats';
import { shareCertificate } from '../../lib/share-image';
import { allCards } from '../hifz';
import { useAuth } from '../auth';

interface SurahProg { n: number; name: string; done: number; total: number }

export function AchievementsScreen() {
  const name = useAuth((s) => s.user?.displayName ?? 'الطالب/ة');
  const nav = useNavigate();
  const [surahs, setSurahs] = useState<SurahProg[]>([]);
  const [report, setReport] = useState({ memorized: 0, streak: 0, pct: 0, minutes: 0 });

  useEffect(() => {
    void (async () => {
      const [cards, list, days, khatmah, minutes] = await Promise.all([
        allCards(), surahList(), getKv<string[]>('streakDays'), getKv<KhatmahPlan>('khatmah'), readMinutes(),
      ]);
      const byS = new Map<number, number>();
      for (const c of cards) byS.set(c.surah, (byS.get(c.surah) ?? 0) + 1);
      const prog = [...byS.entries()]
        .map(([n, done]) => ({ n, done, name: list.find((s) => s.n === n)?.name ?? `سورة ${arabicNum(n)}`, total: list.find((s) => s.n === n)?.count ?? done }))
        .sort((a, b) => b.done / b.total - a.done / a.total);
      setSurahs(prog);
      setReport({ memorized: cards.length, streak: computeStreak(days ?? []), pct: khatmah ? progressPct(khatmah) : 0, minutes: minutes.total });
    })();
  }, []);

  const reportBody = `المحفوظ: ${arabicNum(report.memorized)} آية · المواظبة: ${arabicNum(report.streak)} يوم · الختمة: ${arabicNum(report.pct)}٪ · دقائق التلاوة: ${arabicNum(report.minutes)}`;

  return (
    <section className="screen">
      <AppHeader section="الشهادات والإنجازات" />

      <div className="ach-card ach-card--report">
        <div className="ach-card__title"><Icon name="star" size={18} /> تقرير التقدّم</div>
        <p className="ach-card__body">{reportBody}</p>
        <button className="btn btn--sm" onClick={() => void shareCertificate('تقرير التقدّم', name, reportBody)}>
          <span className="btn__row"><Icon name="share" size={16} /> مشاركة التقرير</span>
        </button>
      </div>

      <div className="sec-head"><span className="sec-head__title">شهادات الإتقان</span></div>
      {!surahs.length && <p className="field__hint">لا حفظ بعد. ابدأ الحفظ لتنال شهادة الإتقان.</p>}
      <div className="stack">
        {surahs.map((s) => {
          const full = s.done >= s.total;
          return (
            <div key={s.n} className="ach-card">
              <div className="ach-card__row">
                <button className="ach-card__title link" onClick={() => nav(`/mastery/${s.n}`)} style={{ padding: 0, fontSize: 'inherit' }}>{s.name} ›</button>
                <span className={full ? 'tag tag--green' : 'tag'}>{full ? 'مُتقَن' : `${arabicNum(Math.round((s.done / s.total) * 100))}٪`}</span>
              </div>
              <div className="bar-line"><span className="bar-line__fill" style={{ width: `${Math.round((s.done / s.total) * 100)}%` }} /></div>
              <button
                className="btn btn--sm btn--gold"
                disabled={!full}
                onClick={() => void shareCertificate('شهادة إتقان', name, `أتمّ حفظ سورة ${s.name} كاملةً (${arabicNum(s.total)} آية)`)}
              >
                <span className="btn__row"><Icon name="download" size={16} /> شهادة الإتقان</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

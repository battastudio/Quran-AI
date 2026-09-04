import { useEffect, useState } from 'react';
import { AppHeader,Spinner } from '../../components';
import { arabicNum } from '../../lib/format';
import { getKv } from '../../lib/db';
import { computeStreak } from '../../lib/streak';
import { JUZ_START, juzPercent, readMinutes, readPagesSet, streakGrid } from '../../lib/stats';
import { badges, type BadgeState } from '../../lib/badges';
import { allCards } from '../hifz';
import type { KhatmahPlan } from '../../lib/khatmah';
import { progressPct } from '../../lib/khatmah';

export function StatsScreen() {
  const [state, setState] = useState<{
    minutes: { today: number; total: number };
    grid: boolean[][];
    juz: number[];
    bstate: BadgeState;
  } | null>(null);

  useEffect(() => {
    void (async () => {
      const [minutes, pages, cards, days, khatmah] = await Promise.all([
        readMinutes(), readPagesSet(), allCards(), getKv<string[]>('streakDays'), getKv<KhatmahPlan>('khatmah'),
      ]);
      const juz = JUZ_START.slice(0, 30).map((_, i) => juzPercent(pages, i));
      const juz30Done = cards.filter((c) => c.surah >= 78).length >= 200;
      setState({
        minutes,
        grid: streakGrid(days ?? [], 12),
        juz,
        bstate: {
          streak: computeStreak(days ?? []),
          memorized: cards.length,
          juz30Done,
          khatmahPct: khatmah ? progressPct(khatmah) : 0,
          minutes: minutes.total,
        },
      });
    })();
  }, []);

  if (!state) return <Spinner />;
  const earned = badges(state.bstate);

  return (
    <section className="screen">
      <AppHeader section="إحصاءاتي" />
      <div className="hifz-stats">
        <div className="stat"><b>{arabicNum(state.minutes.today)}</b><span>دقائق اليوم</span></div>
        <div className="stat"><b>{arabicNum(state.minutes.total)}</b><span>إجمالي الدقائق</span></div>
        <div className="stat"><b>{arabicNum(earned.filter((b) => b.earned).length)}</b><span>أوسمة</span></div>
      </div>

      <div className="stats-rug">
        <h2 className="stats-h">سجادة الإنجاز · المواظبة</h2>
        <div className="heatmap">
          {state.grid.map((week, w) => (
            <div key={w} className="heatmap__week">
              {week.map((on, d) => <span key={d} className={on ? 'heatmap__cell heatmap__cell--on' : 'heatmap__cell'} />)}
            </div>
          ))}
        </div>
      </div>

      <h2 className="stats-h">تقدّم الأجزاء</h2>
      <div className="juz-grid">
        {state.juz.map((p, i) => (
          <div key={i} className="juz-cell">
            <b style={{ color: p ? 'var(--accent)' : 'var(--muted)' }}>{arabicNum(p)}٪</b>
            <span>جزء {arabicNum(i + 1)}</span>
          </div>
        ))}
      </div>

      <h2 className="stats-h">الأوسمة</h2>
      <div className="badges">
        {earned.map((b) => (
          <div key={b.id} className={b.earned ? 'badge badge--on' : 'badge'}>
            <span className="badge__icon">{b.icon}</span>
            <span>{b.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppHeader, Spinner } from '../../components';
import { arabicNum } from '../../lib/format';
import { getSurah } from '../../lib/quran';
import type { Surah } from '../../lib/types';
import { useReader } from '../../store/reader-store';
import { allCards } from '../hifz';

interface Stage { from: number; to: number; done: number; total: number }

export function MasteryScreen() {
  const { surah } = useParams();
  const n = Number(surah) || 1;
  const nav = useNavigate();
  const goTo = useReader((s) => s.goTo);
  const [data, setData] = useState<{ meta: Surah; stages: Stage[] } | null>(null);

  useEffect(() => {
    void (async () => {
      const [meta, cards] = await Promise.all([getSurah(n), allCards()]);
      if (!meta) return;
      const done = new Set(cards.filter((c) => c.surah === n).map((c) => c.ayah));
      const stages: Stage[] = [];
      for (let from = 1; from <= meta.count; from += 10) {
        const to = Math.min(from + 9, meta.count);
        let d = 0;
        for (let a = from; a <= to; a++) if (done.has(a)) d++;
        stages.push({ from, to, done: d, total: to - from + 1 });
      }
      setData({ meta, stages });
    })();
  }, [n]);

  if (!data) return <section className="screen"><AppHeader section="مسار الإتقان" /><Spinner /></section>;

  const firstOpen = data.stages.findIndex((s) => s.done < s.total);
  const practice = (from: number) => { goTo(n, from); nav('/hifz/practice'); };

  return (
    <section className="screen">
      <AppHeader section={`مسار إتقان ${data.meta.name}`} />
      <div className="mastery">
        {data.stages.map((s, i) => {
          const full = s.done >= s.total;
          const cls = full ? 'mastery__step mastery__step--done' : i === firstOpen ? 'mastery__step mastery__step--now' : 'mastery__step';
          return (
            <div key={i} className={cls}>
              <span className="mastery__dot" />
              <button className="mastery__card" onClick={() => practice(s.from)} style={{ width: '100%', textAlign: 'start', cursor: 'pointer' }}>
                <b>الآيات {arabicNum(s.from)}–{arabicNum(s.to)}</b>
                <span>{full ? 'مُتقَن ✓' : `${arabicNum(s.done)} من ${arabicNum(s.total)} محفوظة — تدرّب ›`}</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

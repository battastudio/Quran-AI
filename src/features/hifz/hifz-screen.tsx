import { useEffect, useState } from 'react';
import { Spinner } from '../../components';
import { getSurah } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import type { HifzCard } from '../../lib/types';
import { allCards, dueCards, gradeCard } from './hifz-api';

const GRADES = [
  { q: 1, label: 'نسيت' },
  { q: 3, label: 'صعب' },
  { q: 4, label: 'جيد' },
  { q: 5, label: 'سهل' },
];

export function HifzScreen() {
  const [total, setTotal] = useState<number | null>(null);
  const [queue, setQueue] = useState<HifzCard[] | null>(null);
  const [text, setText] = useState<string>('');
  const [revealed, setRevealed] = useState(false);

  const load = () => {
    void allCards().then((c) => setTotal(c.length));
    void dueCards().then(setQueue);
  };
  useEffect(load, []);

  const current = queue?.[0];
  useEffect(() => {
    if (!current) return;
    setRevealed(false);
    void getSurah(current.surah).then((s) =>
      setText(s?.ayahs.find((a) => a.a === current.ayah)?.t ?? ''),
    );
  }, [current]);

  async function grade(q: number) {
    if (!current) return;
    await gradeCard(current, q);
    setQueue((prev) => prev!.slice(1));
    void allCards().then((c) => setTotal(c.length));
  }

  if (total === null || queue === null) return <Spinner />;

  return (
    <section className="screen">
      <h1 className="screen__title">الحفظ</h1>
      <div className="hifz-stats">
        <div className="stat"><b>{arabicNum(total)}</b><span>آية محفوظة</span></div>
        <div className="stat"><b>{arabicNum(queue.length)}</b><span>مراجعة اليوم</span></div>
      </div>

      {!current ? (
        <p className="hifz-done">
          {total === 0 ? 'أضف آيات للحفظ من زر ＋ في المصحف.' : 'أحسنت! لا مراجعات مستحقّة الآن.'}
        </p>
      ) : (
        <div className="hifz-review">
          <p className="hifz-ref">سورة {arabicNum(current.surah)} — الآية {arabicNum(current.ayah)}</p>
          {revealed ? (
            <>
              <p className="ayah__text">{text}</p>
              <div className="hifz-grades">
                {GRADES.map((g) => (
                  <button key={g.q} className="btn btn--sm" onClick={() => grade(g.q)}>{g.label}</button>
                ))}
              </div>
            </>
          ) : (
            <button className="btn" onClick={() => setRevealed(true)}>أظهر الآية</button>
          )}
        </div>
      )}
    </section>
  );
}

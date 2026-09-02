import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../../components';
import { getSurah } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import type { HifzCard } from '../../lib/types';
import { allCards, dueCards, gradeCard } from './hifz-api';

const GRADES = [
  { q: 1, label: 'نسيت' }, { q: 3, label: 'صعب' }, { q: 4, label: 'جيد' }, { q: 5, label: 'سهل' },
];

export function HifzScreen() {
  const nav = useNavigate();
  const [total, setTotal] = useState<number | null>(null);
  const [due, setDue] = useState<HifzCard[] | null>(null);
  const [juzMap, setJuzMap] = useState<Record<string, number>>({});
  const [graded, setGraded] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState('all'); // all | weak | juz:N
  const [text, setText] = useState('');
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    void allCards().then((c) => setTotal(c.length));
    void dueCards().then(async (cards) => {
      setDue(cards);
      const map: Record<string, number> = {};
      for (const c of cards) {
        const s = await getSurah(c.surah);
        map[c.key] = s?.ayahs.find((a) => a.a === c.ayah)?.j ?? 0;
      }
      setJuzMap(map);
    });
  }, []);

  const queue = useMemo(() => {
    if (!due) return [];
    return due.filter((c) => {
      if (graded.has(c.key)) return false;
      if (filter === 'weak') return c.ease < 2.1;
      if (filter.startsWith('juz:')) return juzMap[c.key] === Number(filter.slice(4));
      return true;
    });
  }, [due, graded, filter, juzMap]);

  const current = queue[0];
  useEffect(() => {
    if (!current) return;
    setRevealed(false);
    void getSurah(current.surah).then((s) => setText(s?.ayahs.find((a) => a.a === current.ayah)?.t ?? ''));
  }, [current]);

  async function grade(q: number) {
    if (!current) return;
    await gradeCard(current, q);
    setGraded((g) => new Set(g).add(current.key));
  }

  if (total === null || due === null) return <Spinner />;
  const weakN = due.filter((c) => c.ease < 2.1).length;

  return (
    <section className="screen">
      <h1 className="screen__title">الحفظ</h1>
      <div className="hifz-stats">
        <div className="stat"><b>{arabicNum(total)}</b><span>آية محفوظة</span></div>
        <div className="stat"><b>{arabicNum(queue.length)}</b><span>للمراجعة</span></div>
        <div className="stat"><b>{arabicNum(weakN)}</b><span>تحتاج تركيزًا</span></div>
      </div>
      <div className="hifz-controls">
        <select value={filter} onChange={(e) => { setFilter(e.target.value); setGraded(new Set()); }}>
          <option value="all">كل المستحقّة</option>
          <option value="weak">الآيات الضعيفة</option>
          {Array.from({ length: 30 }, (_, i) => <option key={i} value={`juz:${i + 1}`}>الجزء {arabicNum(i + 1)}</option>)}
        </select>
        <button className="btn btn--sm" onClick={() => nav('/hifz/practice')}>تدريب الحفظ</button>
      </div>

      {!current ? (
        <p className="hifz-done">{total === 0 ? 'أضف آيات للحفظ من زر ＋ في المصحف.' : 'لا مراجعات في هذا النطاق الآن.'}</p>
      ) : (
        <div className="hifz-review">
          <p className="hifz-ref">سورة {arabicNum(current.surah)} — الآية {arabicNum(current.ayah)}</p>
          {revealed ? (
            <>
              <p className="ayah__text">{text}</p>
              <div className="hifz-grades">
                {GRADES.map((g) => <button key={g.q} className="btn btn--sm" onClick={() => grade(g.q)}>{g.label}</button>)}
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

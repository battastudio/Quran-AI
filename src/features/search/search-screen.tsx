import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../../components';
import { allAyahsFlat, surahList, type FlatAyah } from '../../lib/quran';
import { normalize } from '../../lib/normalize';
import { arabicNum } from '../../lib/format';
import type { SurahMeta } from '../../lib/types';
import { useReader } from '../../store/reader-store';

interface Indexed extends FlatAyah {
  norm: string;
}

export function SearchScreen() {
  const [index, setIndex] = useState<Indexed[] | null>(null);
  const [names, setNames] = useState<Record<number, string>>({});
  const [types, setTypes] = useState<Record<number, string>>({});
  const [q, setQ] = useState('');
  const [juz, setJuz] = useState(0);
  const [type, setType] = useState('all');
  const goTo = useReader((s) => s.goTo);
  const nav = useNavigate();

  useEffect(() => {
    void allAyahsFlat().then((all) => setIndex(all.map((x) => ({ ...x, norm: normalize(x.t) }))));
    void surahList().then((l: SurahMeta[]) => {
      setNames(Object.fromEntries(l.map((s) => [s.n, s.name])));
      setTypes(Object.fromEntries(l.map((s) => [s.n, s.type])));
    });
  }, []);

  const results = useMemo(() => {
    const nq = normalize(q.trim());
    if (nq.length < 2 || !index) return [];
    return index.filter((x) =>
      x.norm.includes(nq) &&
      (juz === 0 || x.j === juz) &&
      (type === 'all' || types[x.s] === type),
    ).slice(0, 60);
  }, [q, index, juz, type, types]);

  function open(s: number, a: number) {
    goTo(s, a);
    nav('/mushaf');
  }

  if (!index) return <Spinner />;
  return (
    <section className="screen">
      <h1 className="screen__title">البحث</h1>
      <button className="link" onClick={() => nav('/tafsir-search')}>البحث في التفسير ←</button>
      <input
        className="search-input"
        placeholder="ابحث في القرآن…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus
      />
      <div className="search-filters">
        <div className="chips">
          {['all', 'مكية', 'مدنية'].map((t) => (
            <button key={t} className={type === t ? 'chip chip--on' : 'chip'} onClick={() => setType(t)}>{t === 'all' ? 'الكل' : t}</button>
          ))}
        </div>
        <select value={juz} onChange={(e) => setJuz(Number(e.target.value))}>
          <option value={0}>كل الأجزاء</option>
          {Array.from({ length: 30 }, (_, i) => <option key={i} value={i + 1}>الجزء {arabicNum(i + 1)}</option>)}
        </select>
      </div>
      <ul className="search-results">
        {results.map((r) => (
          <li key={`${r.s}:${r.a}`}>
            <button className="search-result" onClick={() => open(r.s, r.a)}>
              <span className="search-result__ref">{names[r.s]} · {arabicNum(r.a)}</span>
              <span className="search-result__text">{r.t}</span>
            </button>
          </li>
        ))}
        {q.trim().length >= 2 && !results.length && <li className="field__hint">لا نتائج.</li>}
      </ul>
    </section>
  );
}

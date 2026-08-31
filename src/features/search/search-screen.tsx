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
  const [q, setQ] = useState('');
  const goTo = useReader((s) => s.goTo);
  const nav = useNavigate();

  useEffect(() => {
    void allAyahsFlat().then((all) => setIndex(all.map((x) => ({ ...x, norm: normalize(x.t) }))));
    void surahList().then((l: SurahMeta[]) =>
      setNames(Object.fromEntries(l.map((s) => [s.n, s.name]))),
    );
  }, []);

  const results = useMemo(() => {
    const nq = normalize(q.trim());
    if (nq.length < 2 || !index) return [];
    return index.filter((x) => x.norm.includes(nq)).slice(0, 60);
  }, [q, index]);

  function open(s: number, a: number) {
    goTo(s, a);
    nav('/mushaf');
  }

  if (!index) return <Spinner />;
  return (
    <section className="screen">
      <h1 className="screen__title">البحث</h1>
      <input
        className="search-input"
        placeholder="ابحث في القرآن…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus
      />
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

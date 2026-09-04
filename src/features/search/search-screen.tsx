import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader,Spinner } from '../../components';
import { allAyahsFlat, surahList, firstAyahOfPage, type FlatAyah } from '../../lib/quran';
import { normalize } from '../../lib/normalize';

const toLatin = (s: string) => s.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
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

  const qn = toLatin(q.trim());
  const refM = qn.match(/^(\d{1,3})\s*[:،\s]\s*(\d{1,3})$/);
  const pageM = qn.match(/^ص(?:فحة)?\s*(\d{1,3})$/);
  async function jump() {
    if (refM) { open(Number(refM[1]), Number(refM[2])); return; }
    if (pageM) { const p = await firstAyahOfPage(Number(pageM[1])); open(p.surah, p.ayah); }
  }

  if (!index) return <Spinner />;
  return (
    <section className="screen">
      <AppHeader section="البحث" />
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
      {(refM || pageM) && (
        <button className="btn btn--block" style={{ marginTop: 12 }} onClick={() => void jump()}>
          {refM ? `اذهب إلى ${arabicNum(Number(refM[1]))} : ${arabicNum(Number(refM[2]))}` : `اذهب إلى صفحة ${arabicNum(Number(pageM![1]))}`}
        </button>
      )}
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

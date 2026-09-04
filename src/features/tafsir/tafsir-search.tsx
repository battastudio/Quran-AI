import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader,Spinner } from '../../components';
import { normalize } from '../../lib/normalize';
import { arabicNum } from '../../lib/format';
import { useReader } from '../../store/reader-store';
import { useTafsirSheet } from './tafsir-store';

interface Entry { s: number; a: number; t: string; n: string }
const BASE = import.meta.env.BASE_URL;

// Search inside the bundled Muyassar tafsir (offline).
export function TafsirSearch() {
  const [index, setIndex] = useState<Entry[] | null>(null);
  const [q, setQ] = useState('');
  const goTo = useReader((s) => s.goTo);
  const showTafsir = useTafsirSheet((s) => s.show);
  const nav = useNavigate();

  useEffect(() => {
    void fetch(`${BASE}data/tafsir-muyassar.json`).then((r) => r.json()).then((map: Record<string, string>) => {
      setIndex(Object.entries(map).map(([k, t]) => {
        const [s, a] = k.split(':').map(Number);
        return { s, a, t, n: normalize(t) };
      }));
    });
  }, []);

  const results = useMemo(() => {
    const nq = normalize(q.trim());
    if (nq.length < 2 || !index) return [];
    return index.filter((e) => e.n.includes(nq)).slice(0, 50);
  }, [q, index]);

  if (!index) return <Spinner />;
  function open(s: number, a: number) { goTo(s, a); showTafsir(s, a); nav('/mushaf'); }

  return (
    <section className="screen">
      <AppHeader section="البحث في التفسير" />
      <input className="search-input" placeholder="ابحث في التفسير الميسّر…" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
      <ul className="search-results">
        {results.map((r) => (
          <li key={`${r.s}:${r.a}`}>
            <button className="search-result" onClick={() => open(r.s, r.a)}>
              <span className="search-result__ref">{arabicNum(r.s)}:{arabicNum(r.a)}</span>
              <span className="search-result__text">{r.t.slice(0, 120)}…</span>
            </button>
          </li>
        ))}
        {q.trim().length >= 2 && !results.length && <li className="field__hint">لا نتائج.</li>}
      </ul>
    </section>
  );
}

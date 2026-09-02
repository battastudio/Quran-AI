import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '../../components';
import { getSurah, surahList } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import { rootOccurrences } from '../../lib/roots';
import { similarAyahs } from '../../lib/mutashabihat';
import { useReader } from '../../store/reader-store';

// Shared list for /root/:root (concordance) and /similar/:s/:a (mutashabihat).
export function OccurrencesScreen() {
  const { root, s, a } = useParams();
  const [refs, setRefs] = useState<{ s: number; a: number; t?: string }[] | null>(null);
  const [names, setNames] = useState<Record<number, string>>({});
  const goTo = useReader((x) => x.goTo);
  const nav = useNavigate();
  const title = root ? `مواضع الجذر «${root}»` : 'آيات متشابهة';

  useEffect(() => {
    void surahList().then((l) => setNames(Object.fromEntries(l.map((x) => [x.n, x.name]))));
    const p = root ? rootOccurrences(root) : similarAyahs(Number(s), Number(a));
    void p.then(async (list) => {
      const withText = await Promise.all(list.map(async (r) => {
        const su = await getSurah(r.s);
        return { s: r.s, a: r.a, t: su?.ayahs.find((x) => x.a === r.a)?.t.slice(0, 60) };
      }));
      setRefs(withText);
    });
  }, [root, s, a]);

  if (!refs) return <Spinner />;
  return (
    <section className="screen">
      <button className="link" onClick={() => nav(-1)}>‹ رجوع</button>
      <h1 className="screen__title">{title} ({arabicNum(refs.length)})</h1>
      <ul className="search-results">
        {refs.map((r) => (
          <li key={`${r.s}:${r.a}`}>
            <button className="search-result" onClick={() => { goTo(r.s, r.a); nav('/mushaf'); }}>
              <span className="search-result__ref">{names[r.s] ?? `سورة ${arabicNum(r.s)}`} · {arabicNum(r.a)}</span>
              {r.t && <span className="search-result__text">{r.t}…</span>}
            </button>
          </li>
        ))}
        {!refs.length && <li className="field__hint">لا مواضع.</li>}
      </ul>
    </section>
  );
}

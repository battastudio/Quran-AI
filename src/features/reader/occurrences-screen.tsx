import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppHeader, Spinner } from '../../components';
import { getSurah, surahList } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import { rootOccurrences } from '../../lib/roots';
import { similarAyahs } from '../../lib/mutashabihat';
import { useReader } from '../../store/reader-store';

// Shared list for /root/:root (concordance) and /similar/:s/:a (mutashabihat).
export function OccurrencesScreen() {
  const { root, s, a } = useParams();
  const [refs, setRefs] = useState<{ s: number; a: number; t?: string }[] | null>(null);
  const [anchor, setAnchor] = useState<{ name: string; t: string } | null>(null);
  const [names, setNames] = useState<Record<number, string>>({});
  const goTo = useReader((x) => x.goTo);
  const nav = useNavigate();
  const title = root ? `مواضع الجذر «${root}»` : 'مشجر المتشابهات';

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
    if (!root && s && a) {
      void getSurah(Number(s)).then((su) => {
        const y = su?.ayahs.find((x) => x.a === Number(a));
        if (su && y) setAnchor({ name: su.name, t: y.t });
      });
    } else setAnchor(null);
  }, [root, s, a]);

  if (!refs) return <section className="screen"><AppHeader section={title} /><Spinner /></section>;
  const open = (rs: number, ra: number) => { goTo(rs, ra); nav('/mushaf'); };

  return (
    <section className="screen">
      <button className="link" onClick={() => nav(-1)}>‹ رجوع</button>
      <AppHeader section={`${title} (${arabicNum(refs.length)})`} />

      {anchor && (
        <div className="simtree-anchor">
          <span className="simtree-anchor__ref">{anchor.name} · {arabicNum(Number(a))}</span>
          <p className="ayah__text simtree-anchor__text">{anchor.t}</p>
        </div>
      )}

      {anchor ? (
        <div className="mastery">
          {refs.map((r) => (
            <div key={`${r.s}:${r.a}`} className="mastery__step mastery__step--done">
              <span className="mastery__dot" />
              <button className="mastery__card" onClick={() => open(r.s, r.a)} style={{ width: '100%', textAlign: 'start', cursor: 'pointer' }}>
                <b>{names[r.s] ?? `سورة ${arabicNum(r.s)}`} · {arabicNum(r.a)}</b>
                {r.t && <span>{r.t}…</span>}
              </button>
            </div>
          ))}
          {!refs.length && <p className="field__hint">لا آيات متشابهة.</p>}
        </div>
      ) : (
        <ul className="search-results">
          {refs.map((r) => (
            <li key={`${r.s}:${r.a}`}>
              <button className="search-result" onClick={() => open(r.s, r.a)}>
                <span className="search-result__ref">{names[r.s] ?? `سورة ${arabicNum(r.s)}`} · {arabicNum(r.a)}</span>
                {r.t && <span className="search-result__text">{r.t}…</span>}
              </button>
            </li>
          ))}
          {!refs.length && <li className="field__hint">لا مواضع.</li>}
        </ul>
      )}
    </section>
  );
}

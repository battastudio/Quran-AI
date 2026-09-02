import { useEffect, useState } from 'react';
import { Spinner } from '../../components';
import { getSurah, words, morphologyFor } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import type { Surah } from '../../lib/types';
import { useWordSheet } from '../words';

// Word-by-word view: each word as a chip with its root beneath. Tap = word sheet.
export function WbwView({ n }: { n: number }) {
  const [surah, setSurah] = useState<Surah | null>(null);
  const [roots, setRoots] = useState<Record<string, string>>({});
  const showWord = useWordSheet((s) => s.show);

  useEffect(() => {
    void getSurah(n).then(async (s) => {
      setSurah(s ?? null);
      if (!s) return;
      const map: Record<string, string> = {};
      for (const a of s.ayahs)
        for (let w = 0; w < words(a.t).length; w++) {
          const m = await morphologyFor(n, a.a, w + 1);
          if (m?.r) map[`${a.a}:${w}`] = m.r;
        }
      setRoots(map);
    });
  }, [n]);

  if (!surah) return <Spinner />;
  return (
    <div className="wbw">
      {surah.ayahs.map((a) => (
        <div key={a.a} className="wbw__ayah">
          <div className="wbw__num">{arabicNum(a.a)}</div>
          <div className="wbw__words">
            {words(a.t).map((w, i) => (
              <button key={i} className="wbw__word" onClick={() => showWord(w, n, a.a, i + 1)}>
                <span className="wbw__w">{w}</span>
                {roots[`${a.a}:${i}`] && <span className="wbw__root">{roots[`${a.a}:${i}`]}</span>}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

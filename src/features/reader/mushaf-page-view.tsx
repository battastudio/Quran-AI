import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon, Spinner } from '../../components';
import { getSurah, words } from '../../lib/quran';
import { ayahMark, arabicNum } from '../../lib/format';
import type { Surah } from '../../lib/types';
import { useWordSheet } from '../words';

// Mushaf page mode: ayahs grouped by page number, swipe/tap between pages.
export function MushafPageView({ n }: { n: number }) {
  const [surah, setSurah] = useState<Surah | null>(null);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const showWord = useWordSheet((s) => s.show);

  useEffect(() => {
    setIdx(0);
    void getSurah(n).then((s) => setSurah(s ?? null));
  }, [n]);

  const pages = useMemo(() => {
    if (!surah) return [];
    const map = new Map<number, Surah['ayahs']>();
    for (const a of surah.ayahs) (map.get(a.p) ?? map.set(a.p, []).get(a.p)!).push(a);
    return [...map.entries()].map(([p, ayahs]) => ({ p, ayahs }));
  }, [surah]);

  if (!surah || !pages.length) return <Spinner />;
  const page = pages[idx];
  const go = (d: number) => {
    const next = idx + d;
    if (next < 0 || next >= pages.length) return;
    setDir(d);
    setIdx(next);
  };

  return (
    <div className="mushaf">
      <div className="mushaf__meta">صفحة {arabicNum(page.p)} · الجزء {arabicNum(page.ayahs[0].j)}</div>
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={idx}
          custom={dir}
          initial={{ opacity: 0, x: dir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -40 }}
          transition={{ duration: 0.25 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, i) => { if (i.offset.x < -60) go(1); else if (i.offset.x > 60) go(-1); }}
          className="mushaf__page"
        >
          <p className="ayah__text mushaf__text">
            {page.ayahs.map((a) => (
              <span key={a.a}>
                {words(a.t).map((w, i) => (
                  <span key={i} className="ayah__word" onClick={() => showWord(w, n, a.a, i + 1)}>{w}{' '}</span>
                ))}
                <span className="ayah__mark">{ayahMark(a.a)}</span>{' '}
              </span>
            ))}
          </p>
        </motion.div>
      </AnimatePresence>
      <div className="mushaf__nav">
        <button className="icon-btn" disabled={idx >= pages.length - 1} onClick={() => go(1)}><Icon name="prev" /></button>
        <span>{arabicNum(idx + 1)} / {arabicNum(pages.length)}</span>
        <button className="icon-btn" disabled={idx <= 0} onClick={() => go(-1)}><Icon name="next" /></button>
      </div>
    </div>
  );
}

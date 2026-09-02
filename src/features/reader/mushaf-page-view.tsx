import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Spinner } from '../../components';
import { getSurah, words } from '../../lib/quran';
import { markPageRead } from '../../lib/stats';
import { ayahMark, arabicNum } from '../../lib/format';
import { tapFeedback } from '../../lib/haptics';
import type { Surah } from '../../lib/types';
import { useWordSheet } from '../words';
import { useReader } from '../../store/reader-store';
import { useSettings } from '../../store/settings-store';

// Mushaf page mode: ayahs grouped by page, real horizontal swipe (carousel slide).
// Swiping past the ends rolls over to the previous/next surah.
export function MushafPageView({ n }: { n: number }) {
  const [surah, setSurah] = useState<Surah | null>(null);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const showWord = useWordSheet((s) => s.show);
  const gotoSurah = useReader((s) => s.setSurah);
  const markRead = useReader((s) => s.markRead);
  const swipeDir = useSettings((s) => s.swipeDir);
  const paper = useSettings((s) => s.mushafPaper);

  useEffect(() => { setIdx(0); void getSurah(n).then((s) => setSurah(s ?? null)); }, [n]);

  const pages = useMemo(() => {
    if (!surah) return [];
    const map = new Map<number, Surah['ayahs']>();
    for (const a of surah.ayahs) (map.get(a.p) ?? map.set(a.p, []).get(a.p)!).push(a);
    return [...map.entries()].map(([p, ayahs]) => ({ p, ayahs }));
  }, [surah]);

  useEffect(() => {
    if (!pages[idx]) return;
    markRead(n, pages[idx].ayahs[0].a);
    void markPageRead(pages[idx].p);
  }, [pages, idx, n, markRead]);

  if (!surah || !pages.length) return <Spinner />;
  const page = pages[idx];
  const go = (d: number) => {
    const next = idx + d;
    if (next < 0) { if (n > 1) gotoSurah(n - 1); return; }
    if (next >= pages.length) { if (n < 114) gotoSurah(n + 1); return; }
    setDir(d);
    setIdx(next);
    tapFeedback();
  };
  const onDrag = (offset: number) => {
    const fwd = swipeDir === 'rtl' ? offset < -60 : offset > 60;
    const back = swipeDir === 'rtl' ? offset > 60 : offset < -60;
    if (fwd) go(1);
    else if (back) go(-1);
  };

  // Slide direction: new page enters from the travel side (no opacity fade).
  const sign = swipeDir === 'rtl' ? 1 : -1;
  const variants = {
    enter: (d: number) => ({ x: `${-d * sign * 100}%` }),
    center: { x: 0 },
    exit: (d: number) => ({ x: `${d * sign * 100}%` }),
  };

  return (
    <div className="mushaf">
      <header className="mushaf__head">
        <b>{surah.name}</b>
        <span>صفحة {arabicNum(page.p)} · الجزء {arabicNum(page.ayahs[0].j)} · {arabicNum(idx + 1)}/{arabicNum(pages.length)}</span>
      </header>
      <div className="mushaf__stage">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={`${n}:${idx}`}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, i) => onDrag(i.offset.x)}
            className={paper ? 'mushaf__page mushaf__page--paper' : 'mushaf__page'}
          >
            <div className="surah-banner">{surah.name}</div>
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
      </div>
    </div>
  );
}

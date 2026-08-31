import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon, Spinner } from '../../components';
import { getSurah, tafsirFor } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import type { Ayah } from '../../lib/types';
import { useSettings } from '../../store/settings-store';

// One swipeable card per ayah with its tafsir underneath.
export function AyahCardsView({ n }: { n: number }) {
  const [ayahs, setAyahs] = useState<Ayah[] | null>(null);
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [taf, setTaf] = useState<string | null>(null);
  const tafsirId = useSettings((s) => s.tafsir);

  useEffect(() => { setI(0); void getSurah(n).then((s) => setAyahs(s?.ayahs ?? [])); }, [n]);
  useEffect(() => {
    if (!ayahs?.[i]) return;
    setTaf(null);
    void tafsirFor(tafsirId, n, ayahs[i].a).then(setTaf);
  }, [ayahs, i, n, tafsirId]);

  if (!ayahs) return <Spinner />;
  const a = ayahs[i];
  const go = (d: number) => { const nx = i + d; if (nx >= 0 && nx < ayahs.length) { setDir(d); setI(nx); } };

  return (
    <div className="cards">
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={i}
          className="card"
          initial={{ opacity: 0, x: dir * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -60 }}
          transition={{ duration: 0.25 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
        >
          <p className="ayah__text card__ayah">{a.t}</p>
          <span className="card__ref">الآية {arabicNum(a.a)}</span>
          <p className="card__tafsir">{taf ?? '…'}</p>
        </motion.div>
      </AnimatePresence>
      <div className="cards__nav">
        <button className="icon-btn" disabled={i >= ayahs.length - 1} onClick={() => go(1)}><Icon name="prev" /></button>
        <span>{arabicNum(i + 1)} / {arabicNum(ayahs.length)}</span>
        <button className="icon-btn" disabled={i <= 0} onClick={() => go(-1)}><Icon name="next" /></button>
      </div>
    </div>
  );
}

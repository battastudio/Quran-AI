import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon, Spinner } from '../../components';
import { getSurah } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import type { Ayah } from '../../lib/types';
import { useReader } from '../../store/reader-store';

// Distraction-free reading: one ayah, large, minimal chrome. Tap to advance.
export function FocusView({ n }: { n: number }) {
  const [ayahs, setAyahs] = useState<Ayah[] | null>(null);
  const [i, setI] = useState(0);
  const markRead = useReader((s) => s.markRead);

  useEffect(() => {
    setI(0);
    void getSurah(n).then((s) => setAyahs(s?.ayahs ?? []));
  }, [n]);

  useEffect(() => { if (ayahs?.[i]) markRead(n, ayahs[i].a); }, [ayahs, i, n, markRead]);

  if (!ayahs) return <Spinner />;
  const a = ayahs[i];

  return (
    <div className="focus" onClick={() => setI((v) => Math.min(v + 1, ayahs.length - 1))}>
      <motion.p key={i} className="ayah__text focus__text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        {a.t}
      </motion.p>
      <div className="focus__bar" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn" disabled={i <= 0} onClick={() => setI(i - 1)}><Icon name="prev" /></button>
        <span>{arabicNum(a.a)} / {arabicNum(ayahs.length)}</span>
        <button className="icon-btn" disabled={i >= ayahs.length - 1} onClick={() => setI(i + 1)}><Icon name="next" /></button>
      </div>
    </div>
  );
}

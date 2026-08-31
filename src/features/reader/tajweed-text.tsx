import { useEffect, useState } from 'react';
import { tajweedFor } from '../../lib/quran';
import { parseTajweed, ruleColor, type TajweedSeg } from '../../lib/tajweed';

// Colored tajwīd rendering for one ayah. Falls back to the plain text while the
// tajwīd data loads. A reading mode — words aren't individually tappable here.
export function TajweedText({ surah, ayah, plain }: { surah: number; ayah: number; plain: string }) {
  const [segs, setSegs] = useState<TajweedSeg[] | null>(null);
  useEffect(() => {
    let ok = true;
    void tajweedFor(surah, ayah).then((m) => ok && setSegs(m ? parseTajweed(m) : [{ text: plain }]));
    return () => {
      ok = false;
    };
  }, [surah, ayah, plain]);

  if (!segs) return <>{plain}</>;
  return (
    <>
      {segs.map((s, i) => (
        <span key={i} style={{ color: ruleColor(s.rule) }}>
          {s.text}
        </span>
      ))}
    </>
  );
}

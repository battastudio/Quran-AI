import { useEffect, useState } from 'react';
import type { FlatAyah } from '../../lib/quran';
import { arabicNum } from '../../lib/format';

function dayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000);
}

interface Props {
  load: () => Promise<FlatAyah[]>;
  name: (surah: number) => string;
  onOpen: (surah: number, ayah: number) => void;
}

// Deterministic ayah for the day — same for everyone, changes daily.
export function VerseOfDay({ load, name, onOpen }: Props) {
  const [v, setV] = useState<FlatAyah | null>(null);
  useEffect(() => {
    void load().then((all) => setV(all[dayOfYear() % all.length] ?? null));
  }, [load]);
  if (!v) return null;
  return (
    <div className="vod" onClick={() => onOpen(v.s, v.a)}>
      <span className="home-card__k">آية اليوم</span>
      <p className="ayah__text vod__text">{v.t}</p>
      <span className="vod__ref">{name(v.s)} · {arabicNum(v.a)}</span>
    </div>
  );
}

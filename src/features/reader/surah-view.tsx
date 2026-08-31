import { useEffect, useState } from 'react';
import { Spinner } from '../../components';
import { getSurah } from '../../lib/quran';
import { allBookmarks } from '../../lib/db';
import type { Surah } from '../../lib/types';
import { useAudio } from '../../store/audio-store';
import { useReader } from '../../store/reader-store';
import { AyahBlock } from './ayah-block';

export function SurahView({ n }: { n: number }) {
  const [surah, setSurah] = useState<Surah | null>(null);
  const [marks, setMarks] = useState<Set<string>>(new Set());
  const [failed, setFailed] = useState(false);
  const playing = useAudio((s) => s.playing);
  const markRead = useReader((s) => s.markRead);
  const targetAyah = useReader((s) => s.targetAyah);
  const clearTarget = useReader((s) => s.clearTarget);

  useEffect(() => {
    setSurah(null);
    setFailed(false);
    void getSurah(n).then((s) => (s ? setSurah(s) : setFailed(true))).catch(() => setFailed(true));
    void allBookmarks().then((b) => setMarks(new Set(b.map((x) => x.key))));
  }, [n]);

  useEffect(() => {
    if (surah) markRead(surah.n, 1);
  }, [surah, markRead]);

  useEffect(() => {
    if (!surah || !targetAyah) return;
    const el = document.getElementById(`ayah-${targetAyah}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el?.classList.add('ayah--flash');
    const t = setTimeout(() => {
      el?.classList.remove('ayah--flash');
      clearTarget();
    }, 1600);
    return () => clearTimeout(t);
  }, [surah, targetAyah, clearTarget]);

  if (failed) return <p className="error">تعذّر تحميل السورة. جرّب مع اتصال بالإنترنت مرّة واحدة.</p>;
  if (!surah) return <Spinner />;

  return (
    <div className="surah">
      {surah.n !== 1 && surah.n !== 9 && <p className="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>}
      {surah.ayahs.map((a) => (
        <AyahBlock
          key={a.a}
          surah={surah.n}
          ayah={a}
          playing={playing?.surah === surah.n && playing.ayah === a.a}
          bookmarked={marks.has(`${surah.n}:${a.a}`)}
        />
      ))}
    </div>
  );
}

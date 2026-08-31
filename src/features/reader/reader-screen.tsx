import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSurah, surahList } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import type { SurahMeta } from '../../lib/types';
import { useReader } from '../../store/reader-store';
import { useAudio } from '../../store/audio-store';
import { SurahView } from './surah-view';
import { SurahPicker } from './surah-picker';

export function ReaderScreen() {
  const surah = useReader((s) => s.surah);
  const setSurah = useReader((s) => s.setSurah);
  const playQueue = useAudio((s) => s.play);
  const nav = useNavigate();
  const [list, setList] = useState<SurahMeta[]>([]);
  const [pick, setPick] = useState(false);

  useEffect(() => {
    void surahList().then(setList);
  }, []);

  const meta = list.find((s) => s.n === surah);

  async function playSurah() {
    const s = await getSurah(surah);
    if (s) playQueue(s.ayahs.map((a) => ({ surah, ayah: a.a })));
  }

  return (
    <section className="screen">
      <header className="reader-head">
        <button className="reader-head__title" onClick={() => setPick(true)}>
          {meta ? meta.name : `سورة ${arabicNum(surah)}`} ▾
        </button>
        <div className="reader-head__nav">
          <button className="icon-btn" aria-label="بحث" onClick={() => nav('/search')}>🔍</button>
          <button className="icon-btn" aria-label="تشغيل السورة" onClick={playSurah}>▶</button>
          <button className="icon-btn" aria-label="السابقة" disabled={surah <= 1} onClick={() => setSurah(surah - 1)}>‹</button>
          <button className="icon-btn" aria-label="التالية" disabled={surah >= 114} onClick={() => setSurah(surah + 1)}>›</button>
        </div>
      </header>
      <SurahView n={surah} />
      <SurahPicker
        open={pick}
        onClose={() => setPick(false)}
        onPick={(n) => {
          setSurah(n);
          setPick(false);
          window.scrollTo(0, 0);
        }}
      />
    </section>
  );
}

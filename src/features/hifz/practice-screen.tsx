import { useEffect, useState } from 'react';
import { Spinner } from '../../components';
import { getSurah, words } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import type { Surah } from '../../lib/types';
import { useReader } from '../../store/reader-store';
import { useAudio } from '../../store/audio-store';

type Mode = 'hide' | 'first';

// Memorization aid: hide words (or show first letters); tap to reveal.
export function PracticeScreen() {
  const n = useReader((s) => s.surah);
  const play = useAudio((s) => s.play);
  const [surah, setSurah] = useState<Surah | null>(null);
  const [mode, setMode] = useState<Mode>('hide');
  const [shown, setShown] = useState<Set<string>>(new Set());

  useEffect(() => { setShown(new Set()); void getSurah(n).then((s) => setSurah(s ?? null)); }, [n]);
  if (!surah) return <Spinner />;

  const reveal = (k: string) => setShown((s) => new Set(s).add(k));
  const listenRepeat = () => play(surah.ayahs.map((a) => ({ surah: n, ayah: a.a, g: a.g })), 0, 3);

  return (
    <section className="screen">
      <h1 className="screen__title">تدريب الحفظ — {surah.name}</h1>
      <div className="chips">
        <button className={mode === 'hide' ? 'chip chip--on' : 'chip'} onClick={() => setMode('hide')}>إخفاء الكلمات</button>
        <button className={mode === 'first' ? 'chip chip--on' : 'chip'} onClick={() => setMode('first')}>الحرف الأول</button>
        <button className="chip" onClick={() => setShown(new Set())}>إعادة</button>
      </div>
      <button className="btn btn--sm" onClick={listenRepeat}>استمع وكرّر ٣×</button>
      <div className="practice">
        {surah.ayahs.map((a) => (
          <p key={a.a} className="ayah__text">
            {words(a.t).map((w, i) => {
              const key = `${a.a}:${i}`;
              const open = shown.has(key);
              return (
                <span key={i} className="practice__w" onClick={() => reveal(key)}>
                  {open ? w : mode === 'first' ? w[0] + '…' : '﮿﮿﮿'}{' '}
                </span>
              );
            })}
            <span className="ayah__mark">{arabicNum(a.a)}</span>{' '}
          </p>
        ))}
      </div>
    </section>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../../components';
import { words } from '../../lib/quran';
import { tokens } from '../../lib/normalize';
import { arabicNum } from '../../lib/format';
import type { Ayah } from '../../lib/types';
import { useAudio } from '../../store/audio-store';
import { listen, speechSupported } from './speech';
import { accuracy, align, type TokenStatus } from './align';
import { MicButton } from './mic-button';
import { AccuracyRing } from './accuracy-ring';
import { Waveform } from './waveform';

const CLS: Record<TokenStatus, string> = { done: 'tok--ok', current: 'tok--cur', wrong: 'tok--bad', pending: '' };

// Drill one ayah at a time: listen → recite → compare → retry/next.
export function DrillTasmi({ surah, ayahs }: { surah: number; ayahs: Ayah[] }) {
  const [i, setI] = useState(0);
  const [heard, setHeard] = useState('');
  const [live, setLive] = useState(false);
  const play = useAudio((s) => s.play);
  const rec = useRef<{ stop: () => void } | null>(null);
  const a = ayahs[i];

  useEffect(() => { setHeard(''); return () => rec.current?.stop(); }, [i]);
  const expected = useMemo(() => tokens(a.t), [a]);
  const status = useMemo(() => align(expected, tokens(heard)).status, [expected, heard]);

  function toggle() {
    if (live) { rec.current?.stop(); setLive(false); return; }
    if (!speechSupported()) return;
    setHeard('');
    rec.current = listen((t) => setHeard(t));
    if (rec.current) setLive(true);
  }
  const move = (d: number) => { const n = i + d; if (n >= 0 && n < ayahs.length) setI(n); };

  return (
    <div className="tasmi">
      <div className="tasmi__head">
        <AccuracyRing value={accuracy(status)} />
        <MicButton active={live} onClick={toggle} disabled={!speechSupported()} />
      </div>
      <Waveform active={live} />
      <div className="tasmi__controls">
        <button className="btn btn--sm" onClick={() => play([{ surah, ayah: a.a, g: a.g }])}><Icon name="play" size={16} /> استمع</button>
        <button className="icon-btn" disabled={i <= 0} onClick={() => move(-1)}><Icon name="prev" /></button>
        <span>{arabicNum(a.a)} / {arabicNum(ayahs.length)}</span>
        <button className="icon-btn" disabled={i >= ayahs.length - 1} onClick={() => move(1)}><Icon name="next" /></button>
      </div>
      <p className="ayah__text tasmi__ayah">
        {words(a.t).map((w, wi) => <span key={wi} className={`tok ${CLS[status[wi] ?? 'pending']}`}>{w}{' '}</span>)}
      </p>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { words } from '../../lib/quran';
import { tokens } from '../../lib/normalize';
import { arabicNum } from '../../lib/format';
import type { Ayah } from '../../lib/types';
import { listen, speechSupported } from './speech';
import { accuracy, align, type TokenStatus } from './align';
import { MicButton } from './mic-button';
import { AccuracyRing } from './accuracy-ring';
import { Waveform } from './waveform';

const CLS: Record<TokenStatus, string> = { done: 'tok--ok', current: 'tok--cur', wrong: 'tok--bad', pending: '' };

// Live follow-along (Web Speech). memorize=true hides the text while reciting.
export function LiveTasmi({ ayahs, memorize }: { surah: number; ayahs: Ayah[]; memorize: boolean }) {
  const [heard, setHeard] = useState('');
  const [live, setLive] = useState(false);
  const rec = useRef<{ stop: () => void } | null>(null);

  useEffect(() => () => rec.current?.stop(), []);

  const { expected, offsets } = useMemo(() => {
    const expected: string[] = [];
    const offsets: number[] = [];
    for (const a of ayahs) { offsets.push(expected.length); expected.push(...tokens(a.t)); }
    return { expected, offsets };
  }, [ayahs]);

  const { status, cursor } = useMemo(() => align(expected, tokens(heard)), [expected, heard]);
  useEffect(() => { document.getElementById(`tw-${cursor}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, [cursor]);

  function toggle() {
    if (live) { rec.current?.stop(); setLive(false); return; }
    if (!speechSupported()) return;
    setHeard('');
    rec.current = listen((t) => setHeard(t));
    if (rec.current) setLive(true);
  }

  const hide = memorize && live; // conceal text during memorization test
  return (
    <div className="tasmi">
      <div className="tasmi__head">
        <AccuracyRing value={accuracy(status)} />
        <MicButton active={live} onClick={toggle} disabled={!speechSupported()} />
      </div>
      <Waveform active={live} />
      {!speechSupported() && <p className="error">هذا المحرّك يتطلّب Chrome. جرّب وضع «دون إنترنت».</p>}
      {!live && heard && (
        <p className="tasmi-summary">
          النتيجة: دقّة {arabicNum(accuracy(status))}٪ · أخطاء {arabicNum(status.filter((s) => s === 'wrong').length)}
        </p>
      )}
      <div className={hide ? 'tasmi-text tasmi-text--hidden' : 'tasmi-text'}>
        {ayahs.map((a, ai) => (
          <p key={a.a} className="ayah__text">
            {words(a.t).map((w, wi) => {
              const gi = offsets[ai] + wi;
              return <span key={wi} id={`tw-${gi}`} className={`tok ${CLS[status[gi] ?? 'pending']}`}>{w}{' '}</span>;
            })}
            <span className="ayah__mark">{arabicNum(a.a)}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

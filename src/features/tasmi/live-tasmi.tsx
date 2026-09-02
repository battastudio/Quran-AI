import { useEffect, useMemo, useRef, useState } from 'react';
import { words } from '../../lib/quran';
import { tokens } from '../../lib/normalize';
import { arabicNum } from '../../lib/format';
import { ayahMark } from '../../lib/format';
import type { Ayah } from '../../lib/types';
import { useWordSheet } from '../words';
import { listen, speechSupported } from './speech';
import { accuracy, align, type TokenStatus } from './align';
import { TasmiLiveBar } from './tasmi-live-bar';
import { getKv, setKv } from '../../lib/db';

async function logScore(key: string, acc: number) {
  const m = (await getKv<Record<string, number>>('reciteScores')) ?? {};
  m[key] = acc;
  await setKv('reciteScores', m);
}

const CLS: Record<TokenStatus, string> = { done: 'wtok--ok', current: 'wtok--cur', wrong: 'wtok--bad', pending: '' };

// Live follow-along on an authentic Mushaf page; words highlight green/red in order.
// memorize=true blurs the text while reciting, then reveals with the result.
export function LiveTasmi({ surah, ayahs, memorize }: { surah: number; ayahs: Ayah[]; memorize: boolean }) {
  const [heard, setHeard] = useState('');
  const [live, setLive] = useState(false);
  const rec = useRef<{ stop: () => void } | null>(null);
  const showWord = useWordSheet((s) => s.show);

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
    if (live) {
      rec.current?.stop();
      setLive(false);
      if (heard) void logScore(`سورة ${surah}`, accuracy(status));
      return;
    }
    if (!speechSupported()) return;
    setHeard('');
    rec.current = listen((t) => setHeard(t));
    if (rec.current) setLive(true);
  }

  const hide = memorize && live;
  return (
    <div className="tasmi">
      {!speechSupported() && <p className="error">هذا المحرّك يتطلّب Chrome. جرّب وضع «دون إنترنت».</p>}
      <div className={hide ? 'mushaf__page mushaf__page--paper tasmi-text--hidden' : 'mushaf__page mushaf__page--paper'}>
        <p className="ayah__text mushaf__text">
          {ayahs.map((a, ai) => (
            <span key={a.a}>
              {words(a.t).map((w, wi) => {
                const gi = offsets[ai] + wi;
                return (
                  <span key={wi} id={`tw-${gi}`} className={`wtok ${CLS[status[gi] ?? 'pending']}`}
                    onClick={() => showWord(w, surah, a.a, wi + 1)}>{w}{' '}</span>
                );
              })}
              <span className="ayah__mark">{ayahMark(a.a)}</span>{' '}
            </span>
          ))}
        </p>
      </div>
      {!live && heard && (
        <p className="tasmi-summary">النتيجة: دقّة {arabicNum(accuracy(status))}٪ · أخطاء {arabicNum(status.filter((s) => s === 'wrong').length)}</p>
      )}
      <TasmiLiveBar active={live} accuracy={accuracy(status)} onToggle={toggle} disabled={!speechSupported()} />
    </div>
  );
}

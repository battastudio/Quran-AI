import { useMemo, useRef, useState } from 'react';
import { Icon } from '../../components';
import { words } from '../../lib/quran';
import { tokens } from '../../lib/normalize';
import { arabicNum } from '../../lib/format';
import type { Ayah } from '../../lib/types';
import { accuracy, align, type TokenStatus } from './align';
import { ensureWhisper, startRecording, transcribe } from './whisper';
import { MicButton } from './mic-button';
import { AccuracyRing } from './accuracy-ring';
import { Waveform } from './waveform';
import { useSettings } from '../../store/settings-store';

const CLS: Record<TokenStatus, string> = { done: 'tok--ok', current: 'tok--cur', wrong: 'tok--bad', pending: '' };

// Fully offline: record an ayah → on-device Whisper → align. Model auto-downloads once.
export function OfflineTasmi({ ayahs }: { surah: number; ayahs: Ayah[] }) {
  const [i, setI] = useState(0);
  const [heard, setHeard] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'recording' | 'checking'>('idle');
  const [progress, setProgress] = useState(0);
  const rec = useRef<{ stop: () => Promise<Float32Array> } | null>(null);
  const model = useSettings((s) => s.asrModel);
  const a = ayahs[i];

  const expected = useMemo(() => tokens(a.t), [a]);
  const status = useMemo(() => align(expected, tokens(heard)).status, [expected, heard]);

  async function toggle() {
    if (state === 'recording') {
      setState('checking');
      const audio = await rec.current!.stop();
      setHeard(await transcribe(audio));
      setState('idle');
      return;
    }
    setHeard('');
    setState('loading');
    try {
      await ensureWhisper(model, (p) => setProgress(Math.round((p.progress ?? 0))));
      rec.current = await startRecording();
      setState('recording');
    } catch {
      setState('idle');
    }
  }

  const move = (d: number) => { const n = i + d; if (n >= 0 && n < ayahs.length) { setI(n); setHeard(''); } };

  return (
    <div className="tasmi">
      <div className="tasmi__head">
        <AccuracyRing value={accuracy(status)} />
        <MicButton active={state === 'recording'} onClick={toggle} disabled={state === 'loading' || state === 'checking'} />
      </div>
      <Waveform active={state === 'recording'} />
      <p className="field__hint">
        {state === 'loading' ? `تنزيل النموذج… ${arabicNum(progress)}٪` :
         state === 'checking' ? 'جارٍ التحقّق…' :
         state === 'recording' ? 'يتم التسجيل — اقرأ الآية ثم اضغط للإيقاف.' :
         'يعمل دون إنترنت (يُنزّل النموذج مرة واحدة، ~٧٥م.ب).'}
      </p>
      <div className="tasmi__controls">
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

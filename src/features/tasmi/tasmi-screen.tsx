import { useEffect, useMemo, useRef, useState } from 'react';
import { Spinner } from '../../components';
import { getSurah, words } from '../../lib/quran';
import { tokens } from '../../lib/normalize';
import { arabicNum } from '../../lib/format';
import type { Ayah } from '../../lib/types';
import { useReader } from '../../store/reader-store';
import { useSettings } from '../../store/settings-store';
import { listen, speechSupported } from './speech';
import { startVosk, type VoskSession } from './vosk';
import { accuracy, align, type TokenStatus } from './align';

const CLS: Record<TokenStatus, string> = { done: 'tok--ok', current: 'tok--cur', wrong: 'tok--bad', pending: '' };

export function TasmiScreen() {
  const surah = useReader((s) => s.surah);
  const modelUrl = useSettings((s) => s.voskModelUrl);
  const [ayahs, setAyahs] = useState<Ayah[] | null>(null);
  const [heard, setHeard] = useState('');
  const [live, setLive] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const online = useRef<{ stop: () => void } | null>(null);
  const offline = useRef<VoskSession | null>(null);
  const finals = useRef('');

  useEffect(() => {
    void getSurah(surah).then((s) => setAyahs(s?.ayahs ?? []));
    return () => stop();
  }, [surah]);

  // Flatten to one expected token stream; keep per-ayah slice offsets.
  const { expected, offsets } = useMemo(() => {
    const expected: string[] = [];
    const offsets: number[] = [];
    for (const a of ayahs ?? []) {
      offsets.push(expected.length);
      expected.push(...tokens(a.t));
    }
    return { expected, offsets };
  }, [ayahs]);

  const { status, cursor } = useMemo(() => align(expected, tokens(heard)), [expected, heard]);

  useEffect(() => {
    document.getElementById(`tw-${cursor}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [cursor]);

  function stop() {
    online.current?.stop();
    offline.current?.stop();
    online.current = offline.current = null;
    setLive(false);
  }

  async function start() {
    setErr(null);
    setHeard('');
    finals.current = '';
    if (modelUrl) {
      try {
        offline.current = await startVosk(modelUrl, (t, final) => {
          if (final) finals.current += ' ' + t;
          setHeard(finals.current + ' ' + (final ? '' : t));
        });
        setLive(true);
      } catch {
        setErr('تعذّر تشغيل المحرّك دون إنترنت. تحقّق من رابط النموذج في الإعدادات.');
      }
      return;
    }
    online.current = listen((t) => setHeard(t));
    if (online.current) setLive(true);
    else setErr('متصفّحك لا يدعم التعرّف على الصوت. استخدم Chrome أو أضِف نموذجًا للعمل دون إنترنت.');
  }

  if (!ayahs) return <Spinner />;
  const engine = modelUrl ? 'دون إنترنت' : speechSupported() ? 'المتصفّح (يتطلّب إنترنت)' : 'غير مدعوم';

  return (
    <section className="screen">
      <h1 className="screen__title">التسميع (تجريبي) · دقّة {arabicNum(accuracy(status))}٪</h1>
      <p className="field__hint">
        تتبّع تلاوتك كلمة بكلمة (المحرّك: {engine}). تتحقّق من الكلمات فقط ولا تحكم على أحكام التجويد.
      </p>
      {err && <p className="error">{err}</p>}
      <button className={live ? 'btn btn--danger' : 'btn'} onClick={live ? stop : start}>
        {live ? '■ إيقاف' : '● ابدأ التسميع'}
      </button>
      <p className="field__hint">سورة {arabicNum(surah)} — غيّرها من تبويب المصحف.</p>
      <div className="tasmi-text">
        {ayahs.map((a, ai) => (
          <p key={a.a} className="ayah__text">
            {words(a.t).map((w, wi) => {
              const gi = offsets[ai] + wi;
              return (
                <span key={wi} id={`tw-${gi}`} className={`tok ${CLS[status[gi] ?? 'pending']}`}>
                  {w}{' '}
                </span>
              );
            })}
            <span className="ayah__mark">{arabicNum(a.a)}</span>
          </p>
        ))}
      </div>
    </section>
  );
}

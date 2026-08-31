import { useState } from 'react';
import { useSettings } from '../../store/settings-store';
import { WHISPER_MODELS, ensureWhisper } from '../tasmi/whisper';

// Offline Tasmi' engine: pick a Whisper model + download it, or set a Vosk model URL.
export function ModelSettings() {
  const { asrModel, voskModelUrl, set } = useSettings();
  const [progress, setProgress] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState(false);

  async function download() {
    setErr(false);
    setReady(false);
    setProgress(0);
    try {
      await ensureWhisper(asrModel, (p) => setProgress(Math.round(p.progress ?? 0)));
      setReady(true);
    } catch {
      setErr(true);
    } finally {
      setProgress(null);
    }
  }

  return (
    <div className="stack">
      <label className="field">
        <span>نموذج التعرّف على الصوت (Whisper — يعمل دون إنترنت)</span>
        <select value={asrModel} onChange={(e) => set({ asrModel: e.target.value })}>
          {WHISPER_MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>
      </label>
      <button className="btn btn--sm" disabled={progress !== null} onClick={download}>
        {progress !== null ? `جارٍ التنزيل… ${progress}٪` : ready ? 'تم التنزيل ✓' : 'تنزيل النموذج'}
      </button>
      {err && <p className="error">تعذّر التنزيل. تحقّق من الاتصال.</p>}
      <p className="field__hint">يُنزَّل النموذج مرة واحدة ويُخزَّن للعمل دون إنترنت. يُستخدم في وضع «دون إنترنت» بالتسميع.</p>

      <label className="field">
        <span>بديل متقدّم: رابط نموذج Vosk (.tar.gz)</span>
        <input className="search-input" type="url" placeholder="اتركه فارغًا لاستخدام Whisper" value={voskModelUrl} onChange={(e) => set({ voskModelUrl: e.target.value.trim() })} />
      </label>
    </div>
  );
}

import { useSettings } from '../../store/settings-store';

// Optional offline Tasmi' engine: paste a Vosk Arabic model (.tar.gz) URL.
// Empty = use the browser's online recognition.
export function TasmiSettings() {
  const url = useSettings((s) => s.voskModelUrl);
  const set = useSettings((s) => s.set);
  return (
    <div className="stack">
      <label className="field">
        <span>رابط نموذج التعرّف دون إنترنت (Vosk .tar.gz)</span>
        <input
          className="search-input"
          type="url"
          placeholder="اتركه فارغًا لاستخدام محرّك المتصفّح"
          value={url}
          onChange={(e) => set({ voskModelUrl: e.target.value.trim() })}
        />
      </label>
      <p className="field__hint">
        بدون رابط: يعمل التسميع عبر المتصفّح (يتطلّب إنترنت). مع رابط نموذج عربي: يعمل دون إنترنت.
        لا يوجد نموذج عربي صغير رسمي؛ النماذج المتاحة كبيرة الحجم — ميزة متقدّمة تجريبية.
      </p>
    </div>
  );
}

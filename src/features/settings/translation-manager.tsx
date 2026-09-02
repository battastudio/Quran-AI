import { useEffect, useState } from 'react';
import { downloadTranslation } from '../../lib/quran';
import { deleteTranslationDownload, downloadedTranslationIds } from '../../lib/db';
import { useSettings } from '../../store/settings-store';

const CATALOG = [
  { id: 'en.sahih', name: 'English — Saheeh International' },
  { id: 'en.pickthall', name: 'English — Pickthall' },
  { id: 'fr.hamidullah', name: 'Français — Hamidullah' },
  { id: 'es.cortes', name: 'Español — Cortés' },
  { id: 'de.aburida', name: 'Deutsch — Abu Rida' },
  { id: 'ur.jalandhry', name: 'اردو — جالندہری' },
  { id: 'id.indonesian', name: 'Indonesia — Kemenag' },
  { id: 'tr.diyanet', name: 'Türkçe — Diyanet' },
  { id: 'ru.kuliev', name: 'Русский — Кулиев' },
  { id: 'bn.bengali', name: 'বাংলা — Muhiuddin Khan' },
];

export function TranslationManager() {
  const active = useSettings((s) => s.translation);
  const set = useSettings((s) => s.set);
  const [down, setDown] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const refresh = () => void downloadedTranslationIds().then(setDown);
  useEffect(refresh, []);

  async function get(id: string) {
    setErr(null); setBusy(id);
    try { await downloadTranslation(id); set({ translation: id }); refresh(); }
    catch { setErr('تعذّر التنزيل. تحقّق من الاتصال.'); }
    finally { setBusy(null); }
  }
  async function remove(id: string) {
    await deleteTranslationDownload(id);
    if (active === id) set({ translation: 'none' });
    refresh();
  }

  return (
    <div className="stack">
      {err && <p className="error">{err}</p>}
      <button className={active === 'none' ? 'chip chip--on' : 'chip'} onClick={() => set({ translation: 'none' })}>بدون ترجمة</button>
      {CATALOG.map((t) => {
        const ready = down.includes(t.id);
        return (
          <div key={t.id} className="row">
            <button className={active === t.id ? 'chip chip--on' : 'chip'} disabled={!ready} onClick={() => set({ translation: t.id })}>{t.name}</button>
            {ready ? <button className="link" onClick={() => remove(t.id)}>حذف</button>
              : <button className="link" disabled={busy === t.id} onClick={() => get(t.id)}>{busy === t.id ? '…' : 'تنزيل'}</button>}
          </div>
        );
      })}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { downloadTafsir } from '../../lib/quran';
import { deleteTafsirDownload, downloadedTafsirIds } from '../../lib/db';
import { useSettings } from '../../store/settings-store';
import type { TafsirBook } from '../../lib/types';

const BASE = import.meta.env.BASE_URL;

// Bundled book is always available; catalog books download on demand → IndexedDB.
export function TafsirManager() {
  const [catalog, setCatalog] = useState<TafsirBook[]>([]);
  const [downloaded, setDownloaded] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const active = useSettings((s) => s.tafsir);
  const setSettings = useSettings((s) => s.set);

  const refresh = () => void downloadedTafsirIds().then((k) => setDownloaded(k as string[]));
  useEffect(() => {
    void fetch(`${BASE}data/tafsir-catalog.json`).then((r) => r.json()).then(setCatalog);
    refresh();
  }, []);

  async function download(id: string) {
    setErr(null);
    setBusy(id);
    try {
      await downloadTafsir(id);
      refresh();
    } catch {
      setErr('تعذّر التنزيل. تحقّق من الاتصال بالإنترنت.');
    } finally {
      setBusy(null);
    }
  }
  async function remove(id: string) {
    await deleteTafsirDownload(id);
    if (active === id) setSettings({ tafsir: 'muyassar' });
    refresh();
  }

  const books: TafsirBook[] = [{ id: 'muyassar', name: 'التفسير الميسّر (مضمَّن)' }, ...catalog];
  return (
    <div className="tafsir-mgr">
      {err && <p className="error">{err}</p>}
      {books.map((b) => {
        const ready = b.id === 'muyassar' || downloaded.includes(b.id);
        return (
          <div key={b.id} className="row">
            <button
              className={active === b.id ? 'chip chip--on' : 'chip'}
              disabled={!ready}
              onClick={() => setSettings({ tafsir: b.id })}
            >
              {b.name}
            </button>
            {b.id !== 'muyassar' &&
              (ready ? (
                <button className="link" onClick={() => remove(b.id)}>حذف</button>
              ) : (
                <button className="link" disabled={busy === b.id} onClick={() => download(b.id)}>
                  {busy === b.id ? 'جارٍ التنزيل…' : 'تنزيل'}
                </button>
              ))}
          </div>
        );
      })}
    </div>
  );
}

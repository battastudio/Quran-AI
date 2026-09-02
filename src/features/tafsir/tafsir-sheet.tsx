import { useEffect, useMemo, useState } from 'react';
import { BottomSheet, Spinner } from '../../components';
import { tafsirFor } from '../../lib/quran';
import { scholarText, IRAB, GHARIB, SPA_TAFSIRS } from '../../lib/scholar';
import { arabicNum } from '../../lib/format';
import { useSettings } from '../../store/settings-store';
import { useTafsirSheet } from './tafsir-store';

type Source = { id: string; name: string; kind: 'tafsir' | 'scholar' };

// Scholar panel: switch between tafsir books, إعراب (grammar) and غريب (word meanings).
export function TafsirSheet() {
  const { open, surah, ayah, close } = useTafsirSheet();
  const active = useSettings((s) => s.tafsir);
  const [sel, setSel] = useState<Source>({ id: active, name: 'التفسير', kind: 'tafsir' });
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (open) setSel({ id: active, name: 'الميسّر', kind: 'tafsir' }); }, [open, active]);

  const sources: Source[] = useMemo(() => [
    { id: active, name: 'المعتمد', kind: 'tafsir' },
    ...SPA_TAFSIRS.map((t) => ({ id: t.id, name: t.name, kind: 'tafsir' as const })),
    { id: IRAB, name: 'الإعراب', kind: 'scholar' as const },
    { id: GHARIB, name: 'غريب الكلمات', kind: 'scholar' as const },
  ], [active]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setText(null);
    const load = sel.kind === 'scholar' ? scholarText(sel.id, surah, ayah) : tafsirFor(sel.id, surah, ayah);
    void load.then(setText).finally(() => setLoading(false));
  }, [open, surah, ayah, sel]);

  return (
    <BottomSheet open={open} title={`الآية ${arabicNum(ayah)}`} onClose={close}>
      <div className="chips scholar-chips">
        {sources.map((s) => (
          <button key={s.id} className={sel.id === s.id ? 'chip chip--on' : 'chip'} onClick={() => setSel(s)}>{s.name}</button>
        ))}
      </div>
      {loading ? <Spinner /> : text ? <p className="tafsir__text">{text}</p> : (
        <p className="tafsir__empty">لا يتوفّر هذا المحتوى لهذه الآية (أو يتطلّب اتصالًا بالإنترنت مرّة واحدة).</p>
      )}
    </BottomSheet>
  );
}

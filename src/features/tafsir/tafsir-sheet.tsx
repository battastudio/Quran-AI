import { useEffect, useState } from 'react';
import { BottomSheet, Spinner } from '../../components';
import { tafsirFor } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import { useSettings } from '../../store/settings-store';
import { useTafsirSheet } from './tafsir-store';

// Ayah tafsir. Uses the active book from settings; 'muyassar' is bundled/offline,
// other books read from their IndexedDB download (else prompt to download in Settings).
export function TafsirSheet() {
  const { open, surah, ayah, close } = useTafsirSheet();
  const tafsirId = useSettings((s) => s.tafsir);
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setText(null);
    void tafsirFor(tafsirId, surah, ayah)
      .then(setText)
      .finally(() => setLoading(false));
  }, [open, surah, ayah, tafsirId]);

  return (
    <BottomSheet open={open} title={`التفسير — الآية ${arabicNum(ayah)}`} onClose={close}>
      {loading ? (
        <Spinner />
      ) : text ? (
        <p className="tafsir__text">{text}</p>
      ) : (
        <p className="tafsir__empty">
          هذا التفسير غير مُنزَّل بعد. نزّله من الإعدادات ← التفسير لعرضه دون إنترنت.
        </p>
      )}
    </BottomSheet>
  );
}

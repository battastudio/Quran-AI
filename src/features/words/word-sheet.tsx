import { useEffect, useState } from 'react';
import { BottomSheet } from '../../components';
import { tafsirFor } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import { wordAudioUrl } from '../../lib/audio-url';
import { useSettings } from '../../store/settings-store';
import { useTafsirSheet } from '../tafsir/tafsir-store';
import { useWordSheet } from './word-store';

// Tap-a-word: pronounce the word + its ayah reference + a jump into the tafsir.
export function WordSheet() {
  const { open, word, surah, ayah, pos, close } = useWordSheet();
  const tafsirId = useSettings((s) => s.tafsir);
  const showTafsir = useTafsirSheet((s) => s.show);
  const [snippet, setSnippet] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSnippet(null);
    void tafsirFor(tafsirId, surah, ayah).then((t) => setSnippet(t ? t.slice(0, 160) + '…' : null));
  }, [open, surah, ayah, tafsirId]);

  const pronounce = () => void new Audio(wordAudioUrl(surah, ayah, pos)).play().catch(() => {});

  return (
    <BottomSheet open={open} title="الكلمة" onClose={close}>
      <p className="word-sheet__word">{word}</p>
      <button className="btn btn--sm" onClick={pronounce}>🔊 نطق الكلمة</button>
      <p className="word-sheet__ref">
        سورة {arabicNum(surah)} — الآية {arabicNum(ayah)}
      </p>
      {snippet && <p className="word-sheet__snippet">{snippet}</p>}
      <button
        className="btn"
        onClick={() => {
          close();
          showTafsir(surah, ayah);
        }}
      >
        تفسير الآية كاملة
      </button>
    </BottomSheet>
  );
}

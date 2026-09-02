import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from '../../components';
import { tafsirFor, morphologyFor, type Morphology } from '../../lib/quran';
import { scholarText, GHARIB } from '../../lib/scholar';
import { arabicNum } from '../../lib/format';
import { wordAudioUrl } from '../../lib/audio-url';

const POS: Record<string, string> = {
  N: 'اسم', PN: 'اسم علم', V: 'فعل', P: 'حرف', PRON: 'ضمير', DET: 'أداة تعريف',
  ADJ: 'صفة', ADV: 'ظرف', REL: 'اسم موصول', DEM: 'اسم إشارة', INTG: 'أداة استفهام', CONJ: 'حرف عطف',
};
import { useSettings } from '../../store/settings-store';
import { useTafsirSheet } from '../tafsir/tafsir-store';
import { useWordSheet } from './word-store';

// Tap-a-word: pronounce the word + its ayah reference + a jump into the tafsir.
export function WordSheet() {
  const { open, word, surah, ayah, pos, close } = useWordSheet();
  const tafsirId = useSettings((s) => s.tafsir);
  const showTafsir = useTafsirSheet((s) => s.show);
  const nav = useNavigate();
  const [snippet, setSnippet] = useState<string | null>(null);
  const [morph, setMorph] = useState<Morphology | null>(null);
  const [gharib, setGharib] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSnippet(null);
    setMorph(null);
    setGharib(null);
    void tafsirFor(tafsirId, surah, ayah).then((t) => setSnippet(t ? t.slice(0, 160) + '…' : null));
    void morphologyFor(surah, ayah, pos).then(setMorph);
    void scholarText(GHARIB, surah, ayah).then((g) => setGharib(g && g.length > 3 ? g : null));
  }, [open, surah, ayah, pos, tafsirId]);

  const pronounce = () => void new Audio(wordAudioUrl(surah, ayah, pos)).play().catch(() => {});

  return (
    <BottomSheet open={open} title="الكلمة" onClose={close}>
      <p className="word-sheet__word">{word}</p>
      <button className="btn btn--sm" onClick={pronounce}>🔊 نطق الكلمة</button>
      {morph && (morph.r || morph.l) && (
        <div className="word-morph">
          {morph.r && <span>الجذر: <b>{morph.r}</b></span>}
          {morph.l && <span>الأصل: <b>{morph.l}</b></span>}
          {morph.p && <span>النوع: <b>{POS[morph.p] ?? morph.p}</b></span>}
        </div>
      )}
      {morph?.r && (
        <button className="btn btn--sm" onClick={() => { close(); nav(`/root/${encodeURIComponent(morph.r)}`); }}>كل مواضع الجذر «{morph.r}»</button>
      )}
      <p className="word-sheet__ref">
        سورة {arabicNum(surah)} — الآية {arabicNum(ayah)}
      </p>
      {gharib && <p className="word-sheet__snippet"><b>غريب الآية: </b>{gharib.slice(0, 220)}</p>}
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

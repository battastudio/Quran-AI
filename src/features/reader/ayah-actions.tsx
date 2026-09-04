import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { create } from 'zustand';
import { BottomSheet, Icon } from '../../components';
import { arabicNum } from '../../lib/format';
import { tafsirFor } from '../../lib/quran';
import { getHighlightColor, toggleBookmark, setHighlight } from '../../lib/db';
import { shareAyahImage } from '../../lib/share-image';
import { useAudio } from '../../store/audio-store';
import { useTafsirSheet } from '../tafsir';
import { useNoteSheet } from '../bookmarks';
import { memorizeAyah } from '../hifz';

interface Target { surah: number; ayah: number; g: number; text: string }
interface State extends Target {
  open: boolean;
  show: (t: Target) => void;
  close: () => void;
}
export const useAyahActions = create<State>((set) => ({
  open: false, surah: 0, ayah: 0, g: 0, text: '',
  show: (t) => set({ open: true, ...t }),
  close: () => set({ open: false }),
}));

const COLORS = ['yellow', 'green', 'blue', 'pink'];

export function AyahActions() {
  const { open, surah, ayah, g, text, close } = useAyahActions();
  const play = useAudio((s) => s.play);
  const showTafsir = useTafsirSheet((s) => s.show);
  const showNote = useNoteSheet((s) => s.show);
  const nav = useNavigate();
  const [hl, setHl] = useState('');
  const ref = `سورة ${arabicNum(surah)} — الآية ${arabicNum(ayah)}`;
  const link = `battastudio.github.io/Quran-AI/#/s/${surah}/${ayah}`;

  useEffect(() => { if (open) void getHighlightColor(surah, ayah).then((c) => setHl(c ?? '')); }, [open, surah, ayah]);

  async function highlight(c: string) {
    const next = hl === c ? '' : c;
    setHl(next);
    await setHighlight(surah, ayah, next);
  }
  const copy = () => void navigator.clipboard?.writeText(`${text}\n${ref}`);
  const shareText = () => (navigator.share ? void navigator.share({ text: `${text}\n${ref}` }) : copy());

  return (
    <BottomSheet open={open} title={ref} onClose={close}>
      <div className="hl-colors">
        {COLORS.map((c) => (
          <button key={c} className={hl === c ? `hl-dot hl-dot--${c} hl-dot--on` : `hl-dot hl-dot--${c}`} aria-label={`تظليل ${c}`} onClick={() => highlight(c)} />
        ))}
        <span className="field__hint">تظليل الآية</span>
      </div>
      <div className="act-grid">
        <button className="act-tile" onClick={() => { play([{ surah, ayah, g }]); close(); }}><Icon name="play" size={22} /><span>استماع</span></button>
        <button className="act-tile" onClick={() => { showTafsir(surah, ayah); close(); }}><Icon name="info" size={22} /><span>التفسير</span></button>
        <button className="act-tile" onClick={async () => { await toggleBookmark(surah, ayah); close(); }}><Icon name="bookmark" size={22} /><span>علامة</span></button>
        <button className="act-tile" onClick={() => { showNote(surah, ayah); close(); }}><Icon name="note" size={22} /><span>ملاحظة</span></button>
        <button className="act-tile" onClick={async () => { await memorizeAyah(surah, ayah); close(); }}><Icon name="plus" size={22} /><span>حفظ</span></button>
        <button className="act-tile" onClick={copy}><Icon name="copy" size={22} /><span>نسخ</span></button>
        <button className="act-tile" onClick={shareText}><Icon name="share" size={22} /><span>مشاركة نص</span></button>
        <button className="act-tile" onClick={() => void shareAyahImage(text, ref, { link })}><Icon name="download" size={22} /><span>صورة</span></button>
        <button className="act-tile" onClick={async () => { const t = await tafsirFor('muyassar', surah, ayah); void shareAyahImage(text, ref, { tafsir: t ?? undefined, format: 'story', template: 'emerald', link }); }}><Icon name="share" size={22} /><span>بطاقة قصة</span></button>
        <button className="act-tile" onClick={() => { close(); nav(`/similar/${surah}/${ayah}`); }}><Icon name="copy" size={22} /><span>المتشابهات</span></button>
      </div>
    </BottomSheet>
  );
}

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { BottomSheet, Icon } from '../../components';
import { arabicNum } from '../../lib/format';
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
  const [hl, setHl] = useState('');
  const ref = `سورة ${arabicNum(surah)} — الآية ${arabicNum(ayah)}`;

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
      <div className="action-grid">
        <button onClick={() => { play([{ surah, ayah, g }]); close(); }}><Icon name="play" /> استماع</button>
        <button onClick={() => { showTafsir(surah, ayah); close(); }}><Icon name="info" /> تفسير</button>
        <button onClick={async () => { await toggleBookmark(surah, ayah); close(); }}><Icon name="bookmark" /> إشارة</button>
        <button onClick={() => { showNote(surah, ayah); close(); }}><Icon name="note" /> ملاحظة</button>
        <button onClick={copy}><Icon name="copy" /> نسخ</button>
        <button onClick={shareText}><Icon name="share" /> مشاركة نص</button>
        <button onClick={() => void shareAyahImage(text, ref)}><Icon name="download" /> صورة</button>
        <button onClick={async () => { await memorizeAyah(surah, ayah); close(); }}><Icon name="plus" /> حفظ</button>
      </div>
    </BottomSheet>
  );
}

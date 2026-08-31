import { useEffect, useState } from 'react';
import { BottomSheet } from '../../components';
import { arabicNum } from '../../lib/format';
import { getNote, setNote } from '../../lib/db';
import { useNoteSheet } from './note-store';

// Per-ayah personal note editor (mounted globally; syncs via the profile).
export function NoteSheet() {
  const { open, surah, ayah, close } = useNoteSheet();
  const [text, setText] = useState('');

  useEffect(() => {
    if (open) void getNote(surah, ayah).then((n) => setText(n?.text ?? ''));
  }, [open, surah, ayah]);

  async function save() {
    await setNote(surah, ayah, text);
    close();
  }

  return (
    <BottomSheet open={open} title={`ملاحظة — الآية ${arabicNum(ayah)}`} onClose={close}>
      <textarea
        className="note-input"
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="اكتب ملاحظتك…"
      />
      <button className="btn" onClick={save}>حفظ</button>
    </BottomSheet>
  );
}

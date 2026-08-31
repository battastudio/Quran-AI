import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { allBookmarks, allNotes, toggleBookmark } from '../../lib/db';
import { surahList } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import { useReader } from '../../store/reader-store';
import { useNoteSheet } from './note-store';

interface Row {
  key: string;
  surah: number;
  ayah: number;
  note?: string;
}

export function BookmarksScreen() {
  const [rows, setRows] = useState<Row[]>([]);
  const [names, setNames] = useState<Record<number, string>>({});
  const goTo = useReader((s) => s.goTo);
  const showNote = useNoteSheet((s) => s.show);
  const noteOpen = useNoteSheet((s) => s.open);
  const nav = useNavigate();

  async function load() {
    const [bm, notes] = await Promise.all([allBookmarks(), allNotes()]);
    const noteMap = new Map(notes.map((n) => [n.key, n.text]));
    const merged = new Map<string, Row>();
    for (const b of bm) merged.set(b.key, { key: b.key, surah: b.surah, ayah: b.ayah, note: noteMap.get(b.key) });
    for (const n of notes) if (!merged.has(n.key)) merged.set(n.key, { key: n.key, surah: n.surah, ayah: n.ayah, note: n.text });
    setRows([...merged.values()].sort((a, b) => a.surah - b.surah || a.ayah - b.ayah));
  }
  useEffect(() => {
    void surahList().then((l) => setNames(Object.fromEntries(l.map((s) => [s.n, s.name]))));
  }, []);
  useEffect(() => {
    if (!noteOpen) void load(); // refresh after the note sheet closes
  }, [noteOpen]);

  return (
    <section className="screen">
      <h1 className="screen__title">المحفوظات والملاحظات</h1>
      {!rows.length && <p className="field__hint">لا محفوظات بعد. المس ★ أو 📝 على أي آية.</p>}
      <ul className="bm-list">
        {rows.map((r) => (
          <li key={r.key} className="bm-item">
            <div className="bm-item__head">
              <button className="link" onClick={() => { goTo(r.surah, r.ayah); nav('/mushaf'); }}>
                {names[r.surah] ?? `سورة ${arabicNum(r.surah)}`} · {arabicNum(r.ayah)}
              </button>
              <span>
                <button className="link" onClick={() => showNote(r.surah, r.ayah)}>ملاحظة</button>
                <button className="link" onClick={async () => { await toggleBookmark(r.surah, r.ayah); void load(); }}>حذف</button>
              </span>
            </div>
            {r.note && <p className="bm-item__note">{r.note}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}

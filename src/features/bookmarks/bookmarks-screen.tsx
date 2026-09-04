import { useEffect, useMemo, useState } from 'react';
import { AppHeader } from '../../components';
import { useNavigate } from 'react-router-dom';
import { allBookmarks, allHighlights, allNotes, setBookmarkFolder, setHighlight, toggleBookmark } from '../../lib/db';
import { surahList } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import { useReader } from '../../store/reader-store';
import { useNoteSheet } from './note-store';

interface Row { key: string; surah: number; ayah: number; note?: string; folder?: string }
interface HL { key: string; surah: number; ayah: number; color: string }

export function BookmarksScreen() {
  const [rows, setRows] = useState<Row[]>([]);
  const [highlights, setHighlights] = useState<HL[]>([]);
  const [names, setNames] = useState<Record<number, string>>({});
  const [folder, setFolder] = useState('all');
  const [editing, setEditing] = useState<string | null>(null);
  const [folderText, setFolderText] = useState('');
  const goTo = useReader((s) => s.goTo);
  const noteOpen = useNoteSheet((s) => s.open);
  const nav = useNavigate();
  const open = (s: number, a: number) => { goTo(s, a); nav('/mushaf'); };
  const name = (n: number) => names[n] ?? `سورة ${arabicNum(n)}`;

  async function load() {
    const [bm, notes, hl] = await Promise.all([allBookmarks(), allNotes(), allHighlights()]);
    const noteMap = new Map(notes.map((n) => [n.key, n.text]));
    const merged = new Map<string, Row>();
    for (const b of bm) merged.set(b.key, { key: b.key, surah: b.surah, ayah: b.ayah, note: noteMap.get(b.key), folder: b.folder });
    for (const n of notes) if (!merged.has(n.key)) merged.set(n.key, { key: n.key, surah: n.surah, ayah: n.ayah, note: n.text });
    setRows([...merged.values()].sort((a, b) => a.surah - b.surah || a.ayah - b.ayah));
    setHighlights(hl.sort((a, b) => a.surah - b.surah || a.ayah - b.ayah));
  }
  useEffect(() => { void surahList().then((l) => setNames(Object.fromEntries(l.map((s) => [s.n, s.name])))); }, []);
  useEffect(() => { if (!noteOpen) void load(); }, [noteOpen]);

  const folders = useMemo(() => ['all', ...new Set(rows.map((r) => r.folder).filter(Boolean) as string[])], [rows]);
  const shown = folder === 'all' ? rows : rows.filter((r) => r.folder === folder);

  return (
    <section className="screen">
      <AppHeader section="المحفوظات والملاحظات" />
      {folders.length > 1 && (
        <div className="chips">
          {folders.map((f) => <button key={f} className={folder === f ? 'chip chip--on' : 'chip'} onClick={() => setFolder(f)}>{f === 'all' ? 'الكل' : f}</button>)}
        </div>
      )}
      {!shown.length && <p className="field__hint">لا محفوظات بعد. استخدم قائمة الإجراءات على أي آية.</p>}
      <ul className="bm-list">
        {shown.map((r) => (
          <li key={r.key} className="bm-item">
            <div className="bm-item__head">
              <button className="link" onClick={() => open(r.surah, r.ayah)}>{name(r.surah)} · {arabicNum(r.ayah)}</button>
              <span>
                <button className="link" onClick={() => { setEditing(editing === r.key ? null : r.key); setFolderText(r.folder ?? ''); }}>مجلّد</button>
                <button className="link" onClick={async () => { await toggleBookmark(r.surah, r.ayah); void load(); }}>حذف</button>
              </span>
            </div>
            {editing === r.key && (
              <div className="bm-item__folder-edit">
                <input className="search-input" placeholder="اسم المجلّد" value={folderText} onChange={(e) => setFolderText(e.target.value)} autoFocus />
                <button className="btn btn--sm" onClick={async () => { await setBookmarkFolder(r.surah, r.ayah, folderText); setEditing(null); void load(); }}>حفظ</button>
              </div>
            )}
            {r.folder && editing !== r.key && <span className="bm-item__folder">📁 {r.folder}</span>}
            {r.note && <p className="bm-item__note">{r.note}</p>}
          </li>
        ))}
      </ul>

      {highlights.length > 0 && (
        <>
          <h2 className="stats-h">التظليلات</h2>
          <ul className="bm-list">
            {highlights.map((h) => (
              <li key={h.key} className="bm-item">
                <div className="bm-item__head">
                  <button className="link" onClick={() => open(h.surah, h.ayah)}>
                    <span className={`hl-dot hl-dot--${h.color}`} style={{ width: 12, height: 12, display: 'inline-block', marginInlineEnd: 6, verticalAlign: 'middle' }} />
                    {name(h.surah)} · {arabicNum(h.ayah)}
                  </button>
                  <button className="link" onClick={async () => { await setHighlight(h.surah, h.ayah, ''); void load(); }}>إزالة</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

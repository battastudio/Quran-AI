import { allBookmarks, allHighlights, allNotes } from './db';

// Export bookmarks, notes and highlights as a Markdown file.
export async function exportMarkdown(): Promise<void> {
  const [bm, notes, hl] = await Promise.all([allBookmarks(), allNotes(), allHighlights()]);
  const lines = ['# نور القرآن — ملاحظاتي\n'];
  if (bm.length) {
    lines.push('## الإشارات المرجعية');
    for (const b of bm) lines.push(`- سورة ${b.surah}:${b.ayah}${b.folder ? ` (${b.folder})` : ''}`);
    lines.push('');
  }
  if (notes.length) {
    lines.push('## الملاحظات');
    for (const n of notes) lines.push(`- **${n.surah}:${n.ayah}** — ${n.text}`);
    lines.push('');
  }
  if (hl.length) {
    lines.push('## التظليلات');
    for (const h of hl) lines.push(`- ${h.surah}:${h.ayah} (${h.color})`);
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nour-al-quran-notes.md';
  a.click();
  URL.revokeObjectURL(url);
}

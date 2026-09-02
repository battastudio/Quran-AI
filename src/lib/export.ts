import { allBookmarks, allHighlights, allNotes } from './db';

interface Ref { surah: number; ayah: number; folder?: string }
interface Note extends Ref { text: string }
interface HL extends Ref { color: string }

// Pure: build the Markdown text (kept separate so it's testable).
export function notesMarkdown(bm: Ref[], notes: Note[], hl: HL[]): string {
  const lines = ['# نور القرآن — ملاحظاتي', ''];
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
  return lines.join('\n');
}

export async function exportMarkdown(): Promise<void> {
  const [bm, notes, hl] = await Promise.all([allBookmarks(), allNotes(), allHighlights()]);
  const blob = new Blob([notesMarkdown(bm, notes, hl)], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nour-al-quran-notes.md';
  a.click();
  URL.revokeObjectURL(url);
}

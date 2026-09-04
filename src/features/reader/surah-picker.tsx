import { useEffect, useMemo, useState } from 'react';
import { BottomSheet } from '../../components';
import { surahList, firstAyahOfPage } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import type { SurahMeta } from '../../lib/types';

interface Props {
  open: boolean;
  onClose: () => void;
  onPick: (n: number) => void;
  onJump?: (surah: number, ayah: number) => void;
}

const toLatin = (s: string) => s.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

export function SurahPicker({ open, onClose, onPick, onJump }: Props) {
  const [list, setList] = useState<SurahMeta[]>([]);
  const [q, setQ] = useState('');
  useEffect(() => {
    if (open && !list.length) void surahList().then(setList);
  }, [open, list.length]);

  const query = toLatin(q.trim());
  // «٢:٢٥٥» / «2 255» → ayah ; «ص ٥٦٢» / «صفحة 562» → page
  const ref = query.match(/^(\d{1,3})\s*[:،\s]\s*(\d{1,3})$/);
  const page = query.match(/^ص(?:فحة)?\s*(\d{1,3})$/);
  const filtered = useMemo(
    () => (query && !ref && !page ? list.filter((s) => s.name.includes(q.trim())) : list),
    [list, q, query, ref, page],
  );

  async function submit() {
    if (ref && onJump) { onJump(Number(ref[1]), Number(ref[2])); return; }
    if (page && onJump) { const p = await firstAyahOfPage(Number(page[1])); onJump(p.surah, p.ayah); return; }
    if (filtered.length === 1) onPick(filtered[0]!.n);
  }

  return (
    <BottomSheet open={open} title="التنقّل في المصحف" onClose={onClose}>
      <input
        className="search-input"
        placeholder="سورة، أو آية (٢:٢٥٥)، أو صفحة (ص ٥٦٢)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') void submit(); }}
        aria-label="ابحث عن سورة أو آية أو صفحة"
      />
      <ul className="surah-picker">
        {filtered.map((s) => (
          <li key={s.n}>
            <button className="surah-picker__item" onClick={() => onPick(s.n)}>
              <span className="surah-picker__n">{arabicNum(s.n)}</span>
              <span className="surah-picker__name">{s.name}</span>
              <span className="surah-picker__meta">{s.type} · {arabicNum(s.count)}</span>
            </button>
          </li>
        ))}
        {!filtered.length && <li className="field__hint">لا نتيجة — جرّب اسم السورة أو ٢:٢٥٥.</li>}
      </ul>
    </BottomSheet>
  );
}

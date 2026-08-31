import { useEffect, useState } from 'react';
import { BottomSheet } from '../../components';
import { surahList } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import type { SurahMeta } from '../../lib/types';

interface Props {
  open: boolean;
  onClose: () => void;
  onPick: (n: number) => void;
}

export function SurahPicker({ open, onClose, onPick }: Props) {
  const [list, setList] = useState<SurahMeta[]>([]);
  useEffect(() => {
    if (open && !list.length) void surahList().then(setList);
  }, [open, list.length]);

  return (
    <BottomSheet open={open} title="اختر السورة" onClose={onClose}>
      <ul className="surah-picker">
        {list.map((s) => (
          <li key={s.n}>
            <button className="surah-picker__item" onClick={() => onPick(s.n)}>
              <span className="surah-picker__n">{arabicNum(s.n)}</span>
              <span className="surah-picker__name">{s.name}</span>
              <span className="surah-picker__meta">
                {s.type} · {arabicNum(s.count)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </BottomSheet>
  );
}

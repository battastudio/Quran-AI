import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../../store/settings-store';
import { useReader } from '../../store/reader-store';

// Horizontal swipe to move between surahs (direction from settings). Uses
// dragDirectionLock so vertical scrolling still works inside the view.
export function SurahSwipe({ children }: { children: ReactNode }) {
  const surah = useReader((s) => s.surah);
  const setSurah = useReader((s) => s.setSurah);
  const dir = useSettings((s) => s.swipeDir);

  return (
    <motion.div
      drag="x"
      dragDirectionLock
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.12}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) < 90) return;
        const forward = dir === 'rtl' ? info.offset.x < 0 : info.offset.x > 0;
        const next = surah + (forward ? 1 : -1);
        if (next >= 1 && next <= 114) setSurah(next);
      }}
    >
      {children}
    </motion.div>
  );
}

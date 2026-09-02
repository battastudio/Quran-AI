import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSettings } from '../../store/settings-store';
import { useReader } from '../../store/reader-store';

// Horizontal swipe to move between surahs (direction from settings). The new
// surah slides in from the travel side (no fade). dragDirectionLock keeps
// vertical scrolling working inside the view.
export function SurahSwipe({ children }: { children: ReactNode }) {
  const surah = useReader((s) => s.surah);
  const setSurah = useReader((s) => s.setSurah);
  const dir = useSettings((s) => s.swipeDir);
  const sign = dir === 'rtl' ? 1 : -1;

  return (
    <div className="surah-swipe">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={surah}
          drag="x"
          dragDirectionLock
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          initial={{ x: `${sign * 30}%` }}
          animate={{ x: 0 }}
          exit={{ x: `${-sign * 30}%` }}
          transition={{ type: 'spring', stiffness: 320, damping: 36 }}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.x) < 90) return;
            const forward = dir === 'rtl' ? info.offset.x < 0 : info.offset.x > 0;
            const next = surah + (forward ? 1 : -1);
            if (next >= 1 && next <= 114) setSurah(next);
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

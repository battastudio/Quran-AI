import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MiniPlayer, PlayerSheet } from '../features/audio';
import { WordSheet } from '../features/words';
import { TafsirSheet } from '../features/tafsir';
import { NoteSheet } from '../features/bookmarks';
import { AyahActions } from '../features/reader';
import { InstallPrompt, UpdateToast } from '../features/install';
import { Onboarding } from '../features/onboarding';
import { InviteSheet } from '../features/share';
import { BottomBar } from './bottom-bar';

export function Shell() {
  const { pathname } = useLocation();
  return (
    <div className="shell">
      <main className="shell__content">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <InstallPrompt />
      <UpdateToast />
      <MiniPlayer />
      <BottomBar />
      <PlayerSheet />
      <WordSheet />
      <TafsirSheet />
      <NoteSheet />
      <AyahActions />
      <InviteSheet />
      <Onboarding />
    </div>
  );
}

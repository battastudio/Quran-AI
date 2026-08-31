import { create } from 'zustand';
import { getKv, setKv } from '../lib/db';
import { recordDay } from '../lib/streak';

interface ReaderState {
  surah: number;
  lastRead: { surah: number; ayah: number } | null;
  targetAyah: number | null; // scroll target after a search/go-to jump
  setSurah: (n: number) => void;
  goTo: (surah: number, ayah: number) => void;
  clearTarget: () => void;
  markRead: (surah: number, ayah: number) => void;
  hydrate: () => Promise<void>;
}

export const useReader = create<ReaderState>((set) => ({
  surah: 1,
  lastRead: null,
  targetAyah: null,
  setSurah: (n) => set({ surah: n, targetAyah: null }),
  goTo: (surah, ayah) => set({ surah, targetAyah: ayah }),
  clearTarget: () => set({ targetAyah: null }),
  markRead: (surah, ayah) => {
    const lastRead = { surah, ayah };
    set({ lastRead });
    void setKv('lastRead', lastRead);
    void recordActivity();
  },
  hydrate: async () => {
    const lastRead = await getKv<{ surah: number; ayah: number }>('lastRead');
    if (lastRead) set({ lastRead, surah: lastRead.surah });
  },
}));

async function recordActivity() {
  const days = (await getKv<string[]>('streakDays')) ?? [];
  const next = recordDay(days);
  if (next !== days) await setKv('streakDays', next);
}

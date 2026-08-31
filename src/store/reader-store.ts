import { create } from 'zustand';
import { getKv, setKv } from '../lib/db';
import { recordDay } from '../lib/streak';

interface Pos {
  surah: number;
  ayah: number;
}

interface ReaderState {
  surah: number;
  lastRead: Pos | null;
  mark: Pos | null; // manual "place marker"
  targetAyah: number | null;
  setSurah: (n: number) => void;
  goTo: (surah: number, ayah: number) => void;
  clearTarget: () => void;
  markRead: (surah: number, ayah: number) => void;
  setMark: () => void;
  hydrate: () => Promise<void>;
}

export const useReader = create<ReaderState>((set, get) => ({
  surah: 1,
  lastRead: null,
  mark: null,
  targetAyah: null,
  setSurah: (n) => set({ surah: n, targetAyah: null }),
  goTo: (surah, ayah) => set({ surah, targetAyah: ayah }),
  clearTarget: () => set({ targetAyah: null }),
  markRead: (surah, ayah) => {
    const cur = get().lastRead;
    if (cur && cur.surah === surah && cur.ayah === ayah) return; // no-op if unchanged
    const lastRead = { surah, ayah };
    set({ lastRead });
    void setKv('lastRead', lastRead);
    void recordActivity();
  },
  setMark: () => {
    const mark = get().lastRead ?? { surah: get().surah, ayah: 1 };
    set({ mark });
    void setKv('readingMark', mark);
  },
  hydrate: async () => {
    const [lastRead, mark] = await Promise.all([
      getKv<Pos>('lastRead'),
      getKv<Pos>('readingMark'),
    ]);
    set({
      lastRead: lastRead ?? null,
      mark: mark ?? null,
      surah: lastRead?.surah ?? 1,
    });
  },
}));

async function recordActivity() {
  const days = (await getKv<string[]>('streakDays')) ?? [];
  const next = recordDay(days);
  if (next !== days) await setKv('streakDays', next);
}

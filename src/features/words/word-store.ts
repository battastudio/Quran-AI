import { create } from 'zustand';

interface WordState {
  open: boolean;
  word: string;
  surah: number;
  ayah: number;
  pos: number; // 1-based word index within the ayah (for pronunciation)
  show: (word: string, surah: number, ayah: number, pos: number) => void;
  close: () => void;
}

export const useWordSheet = create<WordState>((set) => ({
  open: false,
  word: '',
  surah: 0,
  ayah: 0,
  pos: 0,
  show: (word, surah, ayah, pos) => set({ open: true, word, surah, ayah, pos }),
  close: () => set({ open: false }),
}));

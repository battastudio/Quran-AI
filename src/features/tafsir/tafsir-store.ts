import { create } from 'zustand';

interface TafsirSheetState {
  open: boolean;
  surah: number;
  ayah: number;
  show: (surah: number, ayah: number) => void;
  close: () => void;
}

export const useTafsirSheet = create<TafsirSheetState>((set) => ({
  open: false,
  surah: 0,
  ayah: 0,
  show: (surah, ayah) => set({ open: true, surah, ayah }),
  close: () => set({ open: false }),
}));

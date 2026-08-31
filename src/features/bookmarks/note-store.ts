import { create } from 'zustand';

interface NoteState {
  open: boolean;
  surah: number;
  ayah: number;
  show: (surah: number, ayah: number) => void;
  close: () => void;
}

export const useNoteSheet = create<NoteState>((set) => ({
  open: false,
  surah: 0,
  ayah: 0,
  show: (surah, ayah) => set({ open: true, surah, ayah }),
  close: () => set({ open: false }),
}));

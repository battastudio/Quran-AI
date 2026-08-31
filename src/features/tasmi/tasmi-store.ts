import { create } from 'zustand';

export type TasmiMode = 'follow' | 'memorize' | 'drill' | 'offline';

interface TasmiState {
  mode: TasmiMode;
  setMode: (m: TasmiMode) => void;
}

export const useTasmi = create<TasmiState>((set) => ({
  mode: 'follow',
  setMode: (mode) => set({ mode }),
}));

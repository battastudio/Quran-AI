import { create } from 'zustand';
import { getKv, setKv } from '../../lib/db';
import { dayKey } from '../../lib/streak';
import { expectedByToday, type KhatmahPlan } from '../../lib/khatmah';
import { useInvite } from '../share/invite';

interface KhatmahState {
  plan: KhatmahPlan | null;
  hydrate: () => Promise<void>;
  start: (days: number) => void;
  markTodayDone: () => void;
  cancel: () => void;
}

export const useKhatmah = create<KhatmahState>((set, get) => ({
  plan: null,
  hydrate: async () => set({ plan: (await getKv<KhatmahPlan>('khatmah')) ?? null }),
  start: (days) => {
    const plan: KhatmahPlan = { startDate: dayKey(), days, donePages: 0 };
    set({ plan });
    void setKv('khatmah', plan);
  },
  markTodayDone: () => {
    const plan = get().plan;
    if (!plan) return;
    const next = { ...plan, donePages: Math.max(plan.donePages, expectedByToday(plan, dayKey())) };
    set({ plan: next });
    void setKv('khatmah', next);
    useInvite.getState().trigger(); // gratitude moment → one-time da'wah invite
  },
  cancel: () => {
    set({ plan: null });
    void setKv('khatmah', null);
  },
}));

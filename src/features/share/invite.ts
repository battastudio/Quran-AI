import { create } from 'zustand';

const APP_LINK = 'https://battastudio.github.io/Quran-AI/';
export const INVITE_TEXT =
  'تطبيق مصحف كامل يعمل بدون إنترنت، بدون إعلانات، ومجاني للأبد. صدقة جارية 🤍\n' + APP_LINK;

interface InviteState {
  open: boolean;
  /** Show once ever, at a moment of gratitude (after first wird). */
  trigger: () => void;
  openManually: () => void;
  close: () => void;
}

export const useInvite = create<InviteState>((set) => ({
  open: false,
  trigger: () => {
    if (localStorage.getItem('nq_invited')) return;
    set({ open: true });
  },
  openManually: () => set({ open: true }),
  close: () => {
    localStorage.setItem('nq_invited', '1');
    set({ open: false });
  },
}));

export async function shareApp(): Promise<void> {
  if (navigator.share) { try { await navigator.share({ text: INVITE_TEXT }); return; } catch { /* cancelled */ } }
  await navigator.clipboard?.writeText(INVITE_TEXT);
}

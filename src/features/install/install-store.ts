import { create } from 'zustand';

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
}

export const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
export const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as { standalone?: boolean }).standalone === true;

interface InstallState {
  deferred: BIPEvent | null;
  installed: boolean;
  init: () => void;
  promptInstall: () => Promise<void>;
}

// Captures the browser install prompt once so any button (banner, Home, Settings)
// can trigger it. On iOS there's no prompt event → callers show instructions.
export const useInstall = create<InstallState>((set, get) => ({
  deferred: null,
  installed: isStandalone(),
  init: () => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      set({ deferred: e as BIPEvent });
    });
    window.addEventListener('appinstalled', () => set({ deferred: null, installed: true }));
  },
  promptInstall: async () => {
    const d = get().deferred;
    if (!d) return;
    await d.prompt();
    set({ deferred: null });
  },
}));

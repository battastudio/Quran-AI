import { create } from 'zustand';
import type { Settings } from '../lib/types';
import { loadSettings, saveSettings } from '../lib/db';

export const DEFAULTS: Settings = {
  theme: 'auto',
  reciter: 'Alafasy_128kbps',
  tafsir: 'muyassar',
  fontSize: 30,
  showWordHints: true,
  tajweed: false,
  calcMethod: 'UmmAlQura',
  voskModelUrl: '',
  notify: { prayer: true, adhkar: true, kahf: true, fasting: false, hifz: true },
};

interface SettingsState extends Settings {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  set: (patch: Partial<Settings>) => void;
}

function applyTheme(theme: Settings['theme']) {
  const dark =
    theme === 'dark' ||
    (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}

export const useSettings = create<SettingsState>((set, get) => ({
  ...DEFAULTS,
  hydrated: false,
  hydrate: async () => {
    const saved = await loadSettings();
    const merged = { ...DEFAULTS, ...saved, notify: { ...DEFAULTS.notify, ...saved?.notify } };
    applyTheme(merged.theme);
    set({ ...merged, hydrated: true });
  },
  set: (patch) => {
    const next = { ...pick(get()), ...patch };
    if (patch.theme) applyTheme(patch.theme);
    set(patch);
    void saveSettings(next);
  },
}));

function pick(s: SettingsState): Settings {
  const { theme, reciter, tafsir, fontSize, showWordHints, tajweed, calcMethod, voskModelUrl, notify } = s;
  return { theme, reciter, tafsir, fontSize, showWordHints, tajweed, calcMethod, voskModelUrl, notify };
}

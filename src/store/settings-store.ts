import { create } from 'zustand';
import type { Settings } from '../lib/types';
import { loadSettings, saveSettings } from '../lib/db';

export const DEFAULTS: Settings = {
  theme: 'auto',
  ayahFont: 'amiri',
  readerView: 'scroll',
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
  const resolved =
    theme === 'auto'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;
  document.documentElement.dataset.theme = resolved;
}

function applyAyahFont(font: Settings['ayahFont']) {
  document.documentElement.dataset.ayahfont = font;
}

export const useSettings = create<SettingsState>((set, get) => ({
  ...DEFAULTS,
  hydrated: false,
  hydrate: async () => {
    const saved = await loadSettings();
    const merged = { ...DEFAULTS, ...saved, notify: { ...DEFAULTS.notify, ...saved?.notify } };
    applyTheme(merged.theme);
    applyAyahFont(merged.ayahFont);
    set({ ...merged, hydrated: true });
  },
  set: (patch) => {
    const next = { ...pick(get()), ...patch };
    if (patch.theme) applyTheme(patch.theme);
    if (patch.ayahFont) applyAyahFont(patch.ayahFont);
    set(patch);
    void saveSettings(next);
  },
}));

function pick(s: SettingsState): Settings {
  const { theme, ayahFont, readerView, reciter, tafsir, fontSize, showWordHints, tajweed, calcMethod, voskModelUrl, notify } = s;
  return { theme, ayahFont, readerView, reciter, tafsir, fontSize, showWordHints, tajweed, calcMethod, voskModelUrl, notify };
}

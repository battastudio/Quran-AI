import { create } from 'zustand';
import type { Settings } from '../lib/types';
import { loadSettings, saveSettings } from '../lib/db';

export const DEFAULTS: Settings = {
  theme: 'auto',
  ayahFont: 'amiri',
  readerView: 'scroll',
  swipeDir: 'rtl',
  mushafPaper: true,
  reciter: 'ar.alafasy',
  audioBitrate: 128,
  tafsir: 'muyassar',
  fontSize: 30,
  showWordHints: true,
  tajweed: false,
  calcMethod: 'UmmAlQura',
  asrModel: 'onnx-community/whisper-base',
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
    // migrate stale reciter ids (pre-CDN builds saved everyayah folder names)
    if (!merged.reciter.startsWith('ar.')) merged.reciter = DEFAULTS.reciter;
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
  const { theme, ayahFont, readerView, swipeDir, mushafPaper, reciter, audioBitrate, tafsir, fontSize, showWordHints, tajweed, calcMethod, asrModel, voskModelUrl, notify } = s;
  return { theme, ayahFont, readerView, swipeDir, mushafPaper, reciter, audioBitrate, tafsir, fontSize, showWordHints, tajweed, calcMethod, asrModel, voskModelUrl, notify };
}
